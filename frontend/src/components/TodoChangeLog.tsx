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
const getChangeTypeStyles = (changeType: ChangeType): { 
  icon: React.ReactNode; 
  bgColor: string; 
  textColor: string;
  borderColor: string;
  iconBg: string;
} => {
  switch (changeType) {
    case ChangeType.CREATED:
      return {
        icon: <PlusCircleIcon className="h-4 w-4" />,
        bgColor: 'bg-gradient-to-r from-emerald-50 to-green-50',
        textColor: 'text-emerald-800',
        borderColor: 'border-emerald-200',
        iconBg: 'bg-emerald-500'
      };
    case ChangeType.TITLE_UPDATED:
      return {
        icon: <EditIcon className="h-4 w-4" />,
        bgColor: 'bg-gradient-to-r from-blue-50 to-indigo-50',
        textColor: 'text-blue-800',
        borderColor: 'border-blue-200',
        iconBg: 'bg-blue-500'
      };
    case ChangeType.STATUS_UPDATED:
      return {
        icon: <CheckCircleIcon className="h-4 w-4" />,
        bgColor: 'bg-gradient-to-r from-purple-50 to-violet-50',
        textColor: 'text-purple-800',
        borderColor: 'border-purple-200',
        iconBg: 'bg-purple-500'
      };
    case ChangeType.DELETED:
      return {
        icon: <TrashIcon className="h-4 w-4" />,
        bgColor: 'bg-gradient-to-r from-red-50 to-rose-50',
        textColor: 'text-red-800',
        borderColor: 'border-red-200',
        iconBg: 'bg-red-500'
      };
    default:
      return {
        icon: <EditIcon className="h-4 w-4" />,
        bgColor: 'bg-gradient-to-r from-gray-50 to-slate-50',
        textColor: 'text-gray-800',
        borderColor: 'border-gray-200',
        iconBg: 'bg-gray-500'
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
      <div className="mt-4">
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg">
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            <span className="text-gray-600 font-medium">Loading change history...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-red-800 font-medium">Error loading changes</span>
          </div>
          <p className="text-red-600 text-sm mt-1">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  if (!changes || changes.length === 0) {
    return (
      <div className="mt-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
            <ClockIcon className="h-6 w-6 text-gray-400" />
          </div>
          <h4 className="text-gray-600 font-medium mb-1">No change history</h4>
          <p className="text-gray-500 text-sm">This todo hasn't been modified yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
          Change History
        </h4>
        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {changes.length} {changes.length === 1 ? 'change' : 'changes'}
        </div>
      </div>
      
      <div className="space-y-3">
        {changes.map((change, index) => {
          const { icon, bgColor, textColor, borderColor, iconBg } = getChangeTypeStyles(change.changeType);
          return (
            <div 
              key={change.id} 
              className={`${bgColor} ${borderColor} border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group overflow-hidden`}
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`${iconBg} p-2 rounded-lg shadow-sm`}>
                      <div className="text-white">
                        {icon}
                      </div>
                    </div>
                    <div>
                      <h5 className={`font-semibold ${textColor}`}>
                        {formatChangeType(change.changeType)}
                      </h5>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        {formatDate(change.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 bg-white/50 px-2 py-1 rounded-full">
                    #{changes.length - index}
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-white/50">
                  {change.changeType === ChangeType.CREATED && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Created todo with title:</span>
                      <span className="font-medium px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm shadow-sm">
                        {change.newValue}
                      </span>
                    </div>
                  )}

                  {change.changeType === ChangeType.TITLE_UPDATED && (
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="text-sm text-gray-600">Title changed from</span>
                      <span className="font-medium px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm line-through shadow-sm">
                        {change.previousValue}
                      </span>
                      <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                      <span className="font-medium px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm shadow-sm">
                        {change.newValue}
                      </span>
                    </div>
                  )}

                  {change.changeType === ChangeType.STATUS_UPDATED && (
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="text-sm text-gray-600">Status changed from</span>
                      <span className={`font-medium px-3 py-1 rounded-full text-sm shadow-sm ${
                        change.previousValue === 'completed' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {change.previousValue}
                      </span>
                      <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                      <span className={`font-medium px-3 py-1 rounded-full text-sm shadow-sm ${
                        change.newValue === 'completed' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {change.newValue}
                      </span>
                    </div>
                  )}

                  {change.changeType === ChangeType.DELETED && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Todo deleted:</span>
                      <span className="font-medium px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm line-through shadow-sm">
                        {change.previousValue}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
