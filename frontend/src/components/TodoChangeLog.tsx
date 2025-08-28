import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { todoApi } from '../services/todoApi';
import { TodoChange, ChangeType } from '../types/todo';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from './ui/accordion';
import { Loader2, ClockIcon, PlusCircleIcon, EditIcon, CheckCircleIcon, TrashIcon, ArrowRightIcon } from 'lucide-react';
import { format } from 'date-fns';

interface TodoChangeLogProps {
  todoId: string;
}

// Helper function to format change type for display
const formatChangeType = (changeType: ChangeType): string => {
  switch (changeType) {
    case ChangeType.CREATED:
      return 'Created';
    case ChangeType.TITLE_UPDATED:
      return 'Title updated';
    case ChangeType.STATUS_UPDATED:
      return 'Status updated';
    case ChangeType.DELETED:
      return 'Deleted';
    default:
      return changeType;
  }
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy h:mm:ss a');
};

// Helper function to get icon and color for change type
const getChangeTypeStyles = (changeType: ChangeType): { icon: React.ReactNode; bgColor: string; textColor: string } => {
  switch (changeType) {
    case ChangeType.CREATED:
      return {
        icon: <PlusCircleIcon className="h-4 w-4" />,
        bgColor: 'bg-green-100',
        textColor: 'text-green-800'
      };
    case ChangeType.TITLE_UPDATED:
      return {
        icon: <EditIcon className="h-4 w-4" />,
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800'
      };
    case ChangeType.STATUS_UPDATED:
      return {
        icon: <CheckCircleIcon className="h-4 w-4" />,
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-800'
      };
    case ChangeType.DELETED:
      return {
        icon: <TrashIcon className="h-4 w-4" />,
        bgColor: 'bg-red-100',
        textColor: 'text-red-800'
      };
    default:
      return {
        icon: <EditIcon className="h-4 w-4" />,
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800'
      };
  }
};

export const TodoChangeLog: React.FC<TodoChangeLogProps> = ({ todoId }) => {
  const {
    data: changes,
    isLoading,
    error
  } = useQuery({
    queryKey: ['todoChanges', todoId],
    queryFn: () => todoApi.getTodoChanges(todoId),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-2">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        <span>Loading changes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive text-sm py-1">
        Error loading changes: {(error as Error).message}
      </div>
    );
  }

  if (!changes || changes.length === 0) {
    return (
      <div className="text-muted-foreground text-sm py-1">
        No change history available
      </div>
    );
  }

  return (
    <div className="mt-3">
      <h4 className="text-sm font-medium mb-2">Change History</h4>
      <Accordion type="single" collapsible className="w-full">
        {changes.map((change) => {
          const { icon, bgColor, textColor } = getChangeTypeStyles(change.changeType);
          return (
            <AccordionItem key={change.id} value={change.id} className="border rounded-md mb-2 overflow-hidden">
              <AccordionTrigger className="py-3 px-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center w-full justify-between">
                  <div className="flex items-center">
                    <div className={`${bgColor} ${textColor} p-1 rounded-md flex items-center mr-3`}>
                      {icon}
                    </div>
                    <span className="font-medium">{formatChangeType(change.changeType)}</span>
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    {formatDate(change.createdAt)}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm px-4 py-3 bg-slate-50">
                {change.changeType === ChangeType.CREATED && (
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                      <span className="text-muted-foreground mr-2">Created todo with title:</span>
                      <span className="font-medium px-2 py-1 bg-green-100 text-green-800 rounded">{change.newValue}</span>
                    </div>
                  </div>
                )}

                {change.changeType === ChangeType.TITLE_UPDATED && (
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center flex-wrap">
                      <span className="text-muted-foreground mr-2">Title changed from</span>
                      <span className="font-medium px-2 py-1 bg-red-100 text-red-800 rounded line-through mr-2">{change.previousValue}</span>
                      <ArrowRightIcon className="h-4 w-4 text-muted-foreground mx-1" />
                      <span className="font-medium px-2 py-1 bg-green-100 text-green-800 rounded">{change.newValue}</span>
                    </div>
                  </div>
                )}

                {change.changeType === ChangeType.STATUS_UPDATED && (
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center flex-wrap">
                      <span className="text-muted-foreground mr-2">Status changed from</span>
                      <span className="font-medium px-2 py-1 bg-red-100 text-red-800 rounded mr-2">{change.previousValue}</span>
                      <ArrowRightIcon className="h-4 w-4 text-muted-foreground mx-1" />
                      <span className="font-medium px-2 py-1 bg-green-100 text-green-800 rounded">{change.newValue}</span>
                    </div>
                  </div>
                )}

                {change.changeType === ChangeType.DELETED && (
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                      <span className="text-muted-foreground mr-2">Todo deleted:</span>
                      <span className="font-medium px-2 py-1 bg-red-100 text-red-800 rounded line-through">{change.previousValue}</span>
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};
