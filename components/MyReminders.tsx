
import React, { useState, useEffect } from 'react';
import { UserReminder, EthiopianEvent, ReminderPriority, ReminderCategory } from '../types';

interface MyRemindersProps {
  reminders: UserReminder[];
  events: EthiopianEvent[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, note: string) => void;
  onClearAll: () => void;
}

const CategoryIcon: React.FC<{ category: ReminderCategory }> = ({ category }) => {
  switch (category) {
    case 'Travel': return <span>✈️</span>;
    case 'Religious': return <span>⛪</span>;
    case 'Social': return <span>👫</span>;
    default: return <span>📝</span>;
  }
};

const PriorityBadge: React.FC<{ priority: ReminderPriority }> = ({ priority }) => {
  const colors = {
    Low: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    Medium: 'bg-amber-50 text-amber-600 border-amber-100',
    High: 'bg-red-50 text-red-600 border-red-100',
  };
  return (
    <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${colors[priority]}`}>
      {priority}
    </span>
  );
};

const ReminderItem: React.FC<{
  reminder: UserReminder;
  event?: EthiopianEvent;
  onDelete: (id: string) => void;
  onUpdate: (id: string, note: string) => void;
}> = ({ reminder, event, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editNote, setEditNote] = useState(reminder.note);

  useEffect(() => {
    setEditNote(reminder.note);
  }, [reminder.note]);

  const dateObj = new Date(reminder.dateStr);
  const displayDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(reminder.id, editNote);
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-stone-200 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row justify-between items-start group animate-in fade-in duration-300 relative overflow-hidden">
      <div className="flex gap-6 w-full">
        <div className="w-14 h-14 rounded-2xl bg-stone-900 text-amber-500 flex items-center justify-center font-black text-2xl shadow-xl shrink-0 group-hover:scale-110 transition-transform duration-500">
          <CategoryIcon category={reminder.category} />
        </div>
        
        <div className="min-w-0 flex-grow">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h4 className="font-black text-stone-900 truncate pr-4 text-lg leading-tight">
              {event ? event.name : `Note - ${displayDate}`}
            </h4>
            <PriorityBadge priority={reminder.priority} />
            <span className="text-[9px] font-black text-stone-400 bg-stone-100 px-2 py-0.5 rounded uppercase tracking-widest border border-stone-200">
              {reminder.category}
            </span>
          </div>
          
          {isEditing ? (
            <form onSubmit={handleSave} className="mt-3 space-y-3">
              <textarea
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                className="w-full p-5 text-sm text-stone-900 bg-white border-2 border-amber-300 rounded-2xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 focus:outline-none font-medium shadow-inner min-h-[120px]"
                autoFocus
              />
              <div className="flex gap-2">
                <button type="submit" className="bg-amber-500 text-stone-900 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 shadow-lg">Save Changes</button>
                <button type="button" onClick={() => setIsEditing(false)} className="bg-stone-100 text-stone-500 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-stone-200">Cancel</button>
              </div>
            </form>
          ) : (
            <div className="relative">
              <p className="text-stone-700 text-base mt-2 font-medium leading-relaxed break-words bg-stone-50/50 p-4 rounded-2xl border border-stone-100 italic">
                "{reminder.note}"
              </p>
            </div>
          )}

          <div className="flex items-center gap-4 mt-5">
            <div className="flex items-center gap-1.5">
               <svg className="w-3 h-3 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
               <span className="text-[10px] font-bold text-stone-500">{displayDate}</span>
            </div>
            <div className="w-1 h-1 bg-stone-300 rounded-full"></div>
            <span className="text-[10px] font-bold text-stone-400">Created on {new Date(reminder.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      
      {!isEditing && (
        <div className="flex md:flex-col gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity mt-4 md:mt-0 ml-auto md:ml-4">
          <button 
            onClick={() => setIsEditing(true)}
            className="p-3 text-stone-400 hover:text-amber-500 transition-all bg-stone-50 hover:bg-amber-50 rounded-xl border border-stone-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </button>
          <button 
            onClick={() => onDelete(reminder.id)}
            className="p-3 text-stone-400 hover:text-red-500 transition-all bg-stone-50 hover:bg-red-50 rounded-xl border border-stone-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      )}
    </div>
  );
};

const MyReminders: React.FC<MyRemindersProps> = ({ reminders, events, onDelete, onUpdate, onClearAll }) => {
  if (reminders.length === 0) {
    return (
      <div className="bg-white rounded-[3rem] p-24 text-center border border-stone-200 shadow-sm animate-in fade-in duration-700">
        <div className="bg-stone-50 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-10 border border-stone-100 shadow-inner">
          <svg className="w-16 h-16 text-stone-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h3 className="text-3xl font-black text-stone-900 mb-4 tracking-tight">Your Heritage Box is Empty</h3>
        <p className="text-stone-500 max-w-sm mx-auto text-sm font-medium leading-relaxed mb-8">
          Save festival dates, travel plans, and cultural notes to keep your journey organized.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-amber-500 rounded-[1.25rem] flex items-center justify-center text-stone-900 text-2xl font-black shadow-xl shadow-amber-200/50">
            {reminders.length}
          </div>
          <div>
             <h3 className="text-2xl font-black text-stone-900 uppercase tracking-tighter">Your Saved Moments</h3>
             <p className="text-stone-400 text-xs font-bold tracking-widest uppercase">Syncing to local storage</p>
          </div>
        </div>
        <button 
          onClick={onClearAll}
          className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 hover:text-red-500 transition-all px-6 py-3 rounded-2xl hover:bg-red-50 border border-stone-100 hover:border-red-100"
        >
          Destroy All Records
        </button>
      </div>

      <div className="grid gap-6">
        {reminders.map(reminder => (
          <ReminderItem 
            key={reminder.id}
            reminder={reminder}
            event={events.find(e => e.id === reminder.eventId)}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default MyReminders;
