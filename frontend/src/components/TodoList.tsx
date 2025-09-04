import React, { useState, useRef, useEffect } from "react";
import { Todo as TodoType } from "../types/todo";
import { Todo } from "./Todo";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Plus, X, GripVertical } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface TodoListProps {
  todos: TodoType[];
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: TodoType) => void;
  onReorder?: (todoIds: string[]) => void;
  viewMode?: "list" | "board";
  columns?: { id: string; name: string }[];
  onMoveTodoToColumn?: (todoId: string, columnId: string) => void;
  onAddColumn?: (name: string) => void;
  onDeleteColumn?: (id: string) => void; // Add onDeleteColumn prop
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggle,
  onDelete,
  onEdit,
  onReorder,
  viewMode = "list",
  columns = [
    { id: "todo", name: "To Do" },
    { id: "done", name: "Done" },
  ],
  onMoveTodoToColumn,
  onAddColumn,
  onDeleteColumn,
}) => {
  const [newColumnName, setNewColumnName] = useState<string>("");
  const [isAddingColumn, setIsAddingColumn] = useState<boolean>(false);

  // State to store column widths (default width is 256px = 16rem = w-64)
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});

  // Reference to track column being resized
  const resizingColumnRef = useRef<string | null>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  // Load saved column widths from localStorage
  useEffect(() => {
    const savedWidths = localStorage.getItem("todoColumnWidths");
    if (savedWidths) {
      try {
        setColumnWidths(JSON.parse(savedWidths));
      } catch (e) {
        console.error("Failed to parse saved column widths");
      }
    }
  }, []);

  // Save column widths to localStorage when they change
  useEffect(() => {
    if (Object.keys(columnWidths).length > 0) {
      localStorage.setItem("todoColumnWidths", JSON.stringify(columnWidths));
    }
  }, [columnWidths]);

  // Handle start of resize operation
  const handleResizeStart = (columnId: string, e: React.MouseEvent) => {
    e.preventDefault();
    resizingColumnRef.current = columnId;
    startXRef.current = e.clientX;

    // Get current width or use default
    const currentWidth = columnWidths[columnId] || 256;
    startWidthRef.current = currentWidth;

    // Add event listeners for mouse move and mouse up
    document.addEventListener("mousemove", handleResizeMove);
    document.addEventListener("mouseup", handleResizeEnd);
  };

  // Handle resize during mouse movement
  const handleResizeMove = (e: MouseEvent) => {
    if (!resizingColumnRef.current) return;

    const columnId = resizingColumnRef.current;
    const deltaX = e.clientX - startXRef.current;
    const newWidth = Math.max(150, startWidthRef.current + deltaX); // Min width of 150px

    setColumnWidths((prev) => ({
      ...prev,
      [columnId]: newWidth,
    }));
  };

  // Handle end of resize operation
  const handleResizeEnd = () => {
    resizingColumnRef.current = null;
    document.removeEventListener("mousemove", handleResizeMove);
    document.removeEventListener("mouseup", handleResizeEnd);
  };

  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleResizeMove);
      document.removeEventListener("mouseup", handleResizeEnd);
    };
  }, []);

  if (todos.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No todos yet. Add one above!</p>
      </div>
    );
  }

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // If dropped outside a droppable area
    if (!destination) return;

    // If dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    // Handle reordering in list view
    if (viewMode === "list" && source.droppableId === "todos-list" && onReorder) {
      const reorderedTodos = Array.from(todos);
      const [removed] = reorderedTodos.splice(source.index, 1);
      reorderedTodos.splice(destination.index, 0, removed);
      
      // Extract IDs in the new order
      const reorderedIds = reorderedTodos.map(todo => todo.id);
      onReorder(reorderedIds);
      return;
    }

    // Find the todo being dragged
    const sourceColumn = columns.find((col) => col.id === source.droppableId);
    const destColumn = columns.find(
      (col) => col.id === destination.droppableId,
    );

    if (!sourceColumn || !destColumn) return;

    // Get todos for source column
    let sourceTodos = [];
    if (sourceColumn.id === "todo") {
      sourceTodos = todos.filter((todo) => !todo.completed);
    } else if (sourceColumn.id === "done") {
      sourceTodos = todos.filter((todo) => todo.completed);
    } else {
      // For custom columns, we need a way to track which todo belongs to which column
      // This is a simplified implementation
      sourceTodos = todos.filter((todo) => !todo.completed);
    }

    const draggedTodo = sourceTodos[source.index];

    // If moving between columns
    if (source.droppableId !== destination.droppableId) {
      // If moving to "done" column, mark as completed
      if (destination.droppableId === "done") {
        onToggle(draggedTodo.id, true);
      }
      // If moving from "done" column to any other column, mark as not completed
      else if (source.droppableId === "done") {
        onToggle(draggedTodo.id, false);
      }

      // If we have the function to move todos between columns, use it
      if (onMoveTodoToColumn) {
        onMoveTodoToColumn(draggedTodo.id, destination.droppableId);
      }
    }
  };

  const handleAddColumn = () => {
    if (newColumnName.trim() && onAddColumn) {
      onAddColumn(newColumnName.trim());
      setNewColumnName("");
      setIsAddingColumn(false);
    }
  };

  if (viewMode === "board") {
    // Group todos for board view
    const todosByColumn: Record<string, TodoType[]> = {};

    // Initialize each column with an empty array
    columns.forEach((col) => {
      todosByColumn[col.id] = [];
    });

    // Distribute todos to columns
    todos.forEach((todo) => {
      // Get column ID from todo if available (for custom column tracking)
      const todoColumnId = todo.columnId;

      if (todo.completed) {
        todosByColumn["done"].push(todo);
      } else if (
        todoColumnId &&
        columns.some((col) => col.id === todoColumnId)
      ) {
        // If todo has a columnId and that column exists, put it there
        todosByColumn[todoColumnId].push(todo);
      } else {
        // For simplicity, non-completed todos without column go to "todo" column by default
        todosByColumn["todo"].push(todo);
      }
    });

    return (
      <div className="board-container">
        {/* Scrollable container for entire board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="overflow-x-auto scrollbar-hide">
            {/* Columns layout */}
            <div className="flex gap-4 min-w-max">
              {columns.map((column) => {
                // Get column width from state or use default (256px)
                const columnWidth = columnWidths[column.id] || 256;

                return (
                  <div
                    key={column.id}
                    className="relative flex-shrink-0 flex flex-col"
                    style={{ width: `${columnWidth}px` }} // Apply dynamic width
                  >
                    {/* Column header */}
                    <div className="flex justify-between">
                      <h3 className="font-medium text-sm px-2 py-1 mb-3 bg-secondary rounded-md flex-grow">
                        {column.name} ({todosByColumn[column.id]?.length || 0})
                      </h3>

                      {/* Only show delete button for custom columns (not for built-in todo and done columns) */}
                      {column.id !== "todo" && column.id !== "done" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            onDeleteColumn && onDeleteColumn(column.id)
                          }
                          className="h-6 w-6 p-0 ml-1"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* Column content with Droppable */}
                    <Droppable droppableId={column.id}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="space-y-3 min-h-[100px]"
                        >
                          {todosByColumn[column.id]?.map((todo, index) => (
                            <Draggable
                              key={todo.id}
                              draggableId={todo.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <Todo
                                    todo={todo}
                                    onToggle={onToggle}
                                    onDelete={onDelete}
                                    onEdit={onEdit}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>

                    {/* Resize handle */}
                    <div
                      className="absolute top-0 right-0 h-full w-2 cursor-col-resize opacity-0 hover:opacity-100 hover:bg-primary/20 transition-opacity"
                      onMouseDown={(e) => handleResizeStart(column.id, e)}
                    >
                      <div className="absolute top-1/2 right-0 -translate-y-1/2 p-1">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add Column Button */}
              {!isAddingColumn ? (
                <div className="flex-shrink-0 mt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center h-7"
                    onClick={() => setIsAddingColumn(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Column
                  </Button>
                </div>
              ) : (
                <div className="flex-shrink-0 flex items-start gap-2 min-w-[200px] mt-1">
                  <Input
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                    placeholder="Column name"
                    className="h-7 text-sm"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddColumn();
                      if (e.key === "Escape") setIsAddingColumn(false);
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={handleAddColumn}
                    className="h-7 px-2"
                  >
                    Add
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddingColumn(false)}
                    className="h-7 px-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DragDropContext>
      </div>
    );
  }

  // Default list view
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="todos-list">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-3"
          >
            {todos.map((todo, index) => (
              <Draggable key={todo.id} draggableId={todo.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`transition-all duration-200 ${
                      snapshot.isDragging 
                        ? 'opacity-75 scale-105 shadow-lg' 
                        : 'hover:bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center group">
                      <div
                        {...provided.dragHandleProps}
                        className="mr-2 p-2 cursor-move hover:bg-primary/10 hover:text-primary rounded transition-colors duration-200 group-hover:bg-muted/50"
                      >
                        <GripVertical className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                      </div>
                      <div className="flex-1">
                        <Todo
                          todo={todo}
                          onToggle={onToggle}
                          onDelete={onDelete}
                          onEdit={onEdit}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
