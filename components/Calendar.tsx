
import React, { useState, useMemo } from 'react';
import { CalendarDay, EthiopianEvent } from '../types';
import { generateGregorianCalendar, toEthiopianDate } from '../utils/dateConverter';
import { EVENTS_DATA } from '../constants';

interface CalendarProps {
  onSelectDate: (day: CalendarDay) => void;
  selectedDate: Date | null;
}

const Calendar: React.FC<CalendarProps> = ({ onSelectDate, selectedDate }) => {
  // We use Gregorian as the base layout for modern compatibility
  const [gMonth, setGMonth] = useState(new Date().getMonth());
  const [gYear, setGYear] = useState(new Date().getFullYear());

  const days = useMemo(() => {
    return generateGregorianCalendar(gMonth, gYear, EVENTS_DATA);
  }, [gMonth, gYear]);

  /**
   * Generates the dual-language title for the header.
   */
  const headerContent = useMemo(() => {
    const gregTitle = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(gYear, gMonth));
    
    // Calculate which Ethiopian months are covered by this Gregorian month
    const firstDayEth = days[0]?.ethiopian;
    const lastDayEth = days[days.length - 1]?.ethiopian;
    
    if (!firstDayEth || !lastDayEth) return null;

    let ethRangeAmharic = firstDayEth.monthNameAmharic;
    let ethRangeEnglish = firstDayEth.monthName;

    if (firstDayEth.month !== lastDayEth.month) {
      ethRangeAmharic += ` / ${lastDayEth.monthNameAmharic}`;
      ethRangeEnglish += ` / ${lastDayEth.monthName}`;
    }
    
    return (
      <div className="flex flex-col items-start">
        <h2 className="text-2xl font-black tracking-tighter leading-tight uppercase">
          {gregTitle}
        </h2>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-amber-500 text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap">Integrated Calendar</span>
          <div className="h-3 w-[1px] bg-stone-700 mx-1"></div>
          <span className="text-stone-400 text-[11px] font-bold ethiopic-font">
            {ethRangeAmharic} {firstDayEth.year}
          </span>
          <span className="text-stone-600 text-[9px] font-black uppercase tracking-widest hidden sm:inline-block">
            ({ethRangeEnglish})
          </span>
        </div>
      </div>
    );
  }, [gMonth, gYear, days]);

  const next = () => {
    if (gMonth === 11) {
      setGMonth(0);
      setGYear(y => y + 1);
    } else {
      setGMonth(m => m + 1);
    }
  };

  const prev = () => {
    if (gMonth === 0) {
      setGMonth(11);
      setGYear(y => y - 1);
    } else {
      setGMonth(m => m - 1);
    }
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const firstDayOffset = days[0]?.gregorian.getDay() || 0;

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 overflow-hidden border border-stone-200 animate-in fade-in duration-500">
      <div className="bg-stone-900 px-6 py-6 text-white flex flex-row justify-between items-center border-b border-stone-800">
        <div className="flex-1">
          {headerContent}
        </div>
        <div className="flex gap-2">
          <button onClick={prev} className="p-3 hover:bg-stone-800 rounded-xl border border-stone-700 text-stone-400 transition-all hover:text-amber-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={next} className="p-3 hover:bg-stone-800 rounded-xl border border-stone-700 text-stone-400 transition-all hover:text-amber-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-7 w-full text-center text-[10px] font-black text-stone-300 uppercase tracking-[0.2em] mb-4">
          {dayNames.map((d, i) => <div key={`${d}-${i}`}>{d}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {/* Padding for the start of the month */}
          {Array.from({ length: firstDayOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="h-24 bg-stone-50/50 rounded-2xl border border-dashed border-stone-100" />
          ))}
          
          {days.map((day) => {
            const hasEvent = day.events.length > 0;
            const isSelected = selectedDate?.toDateString() === day.gregorian.toDateString();
            
            return (
              <button
                key={day.gregorian.toISOString()}
                onClick={() => onSelectDate(day)}
                className={`h-24 rounded-2xl border flex flex-col items-center justify-center relative transition-all group overflow-hidden
                  ${isSelected ? 'bg-stone-900 border-stone-900 text-white shadow-2xl scale-[1.05] z-10' : 'bg-white border-stone-100 hover:border-amber-400 hover:bg-stone-50/50'}
                  ${day.isToday ? 'ring-2 ring-amber-500 ring-offset-2' : ''}
                `}
              >
                {/* Visual marker for Today */}
                {day.isToday && (
                  <div className="absolute top-2 right-2 flex flex-col items-end">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                  </div>
                )}
                
                {/* Gregorian Day (Primary) */}
                <span className={`text-xl font-black leading-none mb-1 ${isSelected ? 'text-amber-500' : 'text-stone-900'}`}>
                  {day.gregorian.getDate()}
                </span>
                
                {/* Ethiopian Date (Secondary) */}
                <span className={`text-[9px] font-black uppercase tracking-tight text-center px-1 leading-tight ethiopic-font ${isSelected ? 'text-stone-400' : 'text-stone-400'}`}>
                  {day.ethiopian.day} {day.ethiopian.monthNameAmharic}
                </span>
                
                {hasEvent && (
                  <div className="mt-2 flex gap-1">
                    {day.events.map(e => (
                      <div key={e.id} className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
                    ))}
                  </div>
                )}
                
                {hasEvent && (
                   <div className={`mt-1 text-[7px] font-black truncate px-2 max-w-full uppercase tracking-tighter ${isSelected ? 'text-amber-400' : 'text-stone-500'}`}>
                     {day.events[0].name.substring(0, 10)}
                   </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
