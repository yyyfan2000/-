/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { 
  Home, 
  Calendar, 
  FileCheck, 
  FileText, 
  User, 
  Bell, 
  Search, 
  Plus, 
  MapPin, 
  Users, 
  Monitor, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  QrCode,
  Plane,
  Hotel,
  Coffee,
  MoreHorizontal,
  ArrowRight,
  LogOut,
  Fingerprint,
  Wifi,
  History,
  Sparkles,
  XCircle,
  Check,
  Camera,
  Receipt,
  Heart,
  MessageSquare,
  Share2,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Archive,
  Trash2,
  Download
} from 'lucide-react';
import { TabType, Task, MeetingRoom, Approval, Document as DocType, Itinerary } from './types';
import { MOCK_USER, MOCK_TASKS, MOCK_ROOMS, MOCK_APPROVALS, MOCK_DOCS } from './constants';

// --- Components ---

const BottomNav = ({ activeTab, setActiveTab }: { activeTab: TabType, setActiveTab: (tab: TabType) => void }) => {
  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'home', label: '首页', icon: Home },
    { id: 'meeting', label: '会议', icon: Calendar },
    { id: 'approval', label: '审批', icon: FileCheck },
    { id: 'document', label: '文档', icon: FileText },
    { id: 'attendance', label: '打卡', icon: Fingerprint },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-200 safe-bottom z-50">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
              activeTab === tab.id ? 'text-brand-600' : 'text-slate-400'
            }`}
          >
            <tab.icon size={24} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
            <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

const Header = ({ title, showBack = false, onBack }: { title: string; showBack?: boolean; onBack?: () => void }) => (
  <header className="sticky top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-40 px-4 h-14 flex items-center justify-between">
    <div className="flex items-center gap-3">
      {showBack && (
        <button onClick={onBack} className="p-1 -ml-1 text-slate-600">
          <ChevronRight className="rotate-180" size={24} />
        </button>
      )}
      <h1 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h1>
    </div>
    <div className="flex items-center gap-3">
      <button className="relative p-2 text-slate-600">
        <Bell size={20} />
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
      </button>
      <img src={MOCK_USER.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-slate-200" />
    </div>
  </header>
);

// --- Modules ---

const HomeModule = ({ 
  setActiveTab, 
  tasks,
  isTripDay,
  setIsTripDay,
  isTripEnded,
  setIsTripEnded,
  isAtOffice,
  setIsAtOffice,
  forgotClockIn,
  setForgotClockIn,
  attendanceRecord,
  setNotification,
  onTaskClick
}: { 
  setActiveTab: (tab: TabType) => void, 
  tasks: Task[],
  isTripDay: boolean,
  setIsTripDay: (val: boolean) => void,
  isTripEnded: boolean,
  setIsTripEnded: (val: boolean) => void,
  isAtOffice: boolean,
  setIsAtOffice: (val: boolean) => void,
  forgotClockIn: boolean,
  setForgotClockIn: (val: boolean) => void,
  attendanceRecord: { type: 'in' | 'out'; time: string } | null,
  setNotification: React.Dispatch<React.SetStateAction<{ title: string; body: string; actionLabel?: string; onAction?: () => void } | null>>,
  onTaskClick: (task: Task) => void
}) => {
  const handleToggleTripEnd = () => {
    const newState = !isTripEnded;
    setIsTripEnded(newState);
    if (newState) {
      setNotification({
        title: '出差结束, 请及时报销',
        body: '系统已为您汇总所有发票, 可一键生成报销单',
        actionLabel: '生成报销单',
        onAction: () => setActiveTab('reimbursement')
      });
    }
  };

  const handleToggleAtOffice = () => {
    const newState = !isAtOffice;
    setIsAtOffice(newState);
    if (newState && !attendanceRecord) {
      setNotification({
        title: '您已到公司, 请打卡',
        body: '系统检测到您已进入办公区域, 别忘了开启高效的一天',
        actionLabel: '立即打卡',
        onAction: () => setActiveTab('attendance')
      });
    }
  };

  const handleToggleForgot = () => {
    const newState = !forgotClockIn;
    setForgotClockIn(newState);
    if (newState) {
      setNotification({
        title: '您今日忘记打卡, 请及时补卡',
        body: '下班时间已过, 系统未检测到您的打卡记录',
        actionLabel: '去补卡',
        onAction: () => setActiveTab('attendance')
      });
    }
  };

  return (
    <div className="pb-24 animate-in fade-in duration-500">
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">你好, {MOCK_USER.name}</h2>
            <p className="text-slate-500 text-sm mt-1">今天又是高效协作的一天</p>
          </div>
          {/* Simulation Toggles */}
          <div className="flex flex-col gap-2">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-2">
              <span className="text-[8px] font-bold text-slate-400 px-2 uppercase">模拟到公司</span>
              <button 
                onClick={handleToggleAtOffice}
                className={`w-8 h-4 rounded-full transition-colors relative ${isAtOffice ? 'bg-brand-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isAtOffice ? 'left-4.5' : 'left-0.5'}`} />
              </button>
            </div>
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-2">
              <span className="text-[8px] font-bold text-slate-400 px-2 uppercase">模拟忘打卡</span>
              <button 
                onClick={handleToggleForgot}
                className={`w-8 h-4 rounded-full transition-colors relative ${forgotClockIn ? 'bg-brand-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${forgotClockIn ? 'left-4.5' : 'left-0.5'}`} />
              </button>
            </div>
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-2">
              <span className="text-[8px] font-bold text-slate-400 px-2 uppercase">模拟出差日</span>
              <button 
                onClick={() => setIsTripDay(!isTripDay)}
                className={`w-8 h-4 rounded-full transition-colors relative ${isTripDay ? 'bg-brand-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isTripDay ? 'left-4.5' : 'left-0.5'}`} />
              </button>
            </div>
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-2">
              <span className="text-[8px] font-bold text-slate-400 px-2 uppercase">模拟出差结束</span>
              <button 
                onClick={handleToggleTripEnd}
                className={`w-8 h-4 rounded-full transition-colors relative ${isTripEnded ? 'bg-brand-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isTripEnded ? 'left-4.5' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Floating Action Buttons */}
        <AnimatePresence>
          {(isAtOffice && !attendanceRecord) && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => setActiveTab('attendance')}
              className="fixed bottom-24 right-6 w-16 h-16 bg-brand-600 text-white rounded-full shadow-2xl shadow-brand-200 flex flex-col items-center justify-center z-[45] active:scale-90 transition-transform"
            >
              <Fingerprint size={24} />
              <span className="text-[10px] font-bold mt-1">打卡</span>
            </motion.button>
          )}
          {forgotClockIn && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => setActiveTab('attendance')}
              className="fixed bottom-24 right-6 w-16 h-16 bg-orange-500 text-white rounded-full shadow-2xl shadow-orange-200 flex flex-col items-center justify-center z-[45] active:scale-90 transition-transform"
            >
              <History size={24} />
              <span className="text-[10px] font-bold mt-1">补卡</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Today's Tasks */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Clock size={18} className="text-brand-500" />
              今日待办
            </h3>
          </div>
          <div className="space-y-3">
            {attendanceRecord && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-4"
              >
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600">
                  <CheckCircle2 size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-emerald-900 text-sm">今日已打卡</h4>
                    <span className="text-[10px] text-emerald-600 font-bold bg-white px-2 py-0.5 rounded-full">正常</span>
                  </div>
                  <p className="text-emerald-700/70 text-xs mt-1 leading-relaxed">上班打卡时间: {attendanceRecord.time}</p>
                </div>
              </motion.div>
            )}
            {isTripDay && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-4"
              >
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600">
                  <Plane size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-emerald-900 text-sm">今日出差</h4>
                    <span className="text-[10px] text-emerald-600 font-bold bg-white px-2 py-0.5 rounded-full">无需打卡</span>
                  </div>
                  <p className="text-emerald-700/70 text-xs mt-1 leading-relaxed">系统已自动为您标记为出差状态，祝您工作顺利！</p>
                </div>
              </motion.div>
            )}
            {tasks.filter(t => !isTripDay || t.type !== 'attendance').map((task) => (
              <motion.div 
                key={task.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onTaskClick(task)}
                className="glass-card rounded-2xl p-4 flex items-start gap-4"
              >
                <div className={`p-2.5 rounded-xl ${
                  task.status === 'urgent' ? 'bg-red-50 text-red-500' : 
                  task.status === 'pending' ? 'bg-amber-50 text-amber-500' : 
                  'bg-blue-50 text-blue-500'
                }`}>
                  {task.type === 'approval' && <FileCheck size={20} />}
                  {task.type === 'meeting' && <Calendar size={20} />}
                  {task.type === 'trip' && <Plane size={20} />}
                  {task.type === 'attendance' && <Fingerprint size={20} />}
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <div className="flex flex-col">
                    <h4 className="font-bold text-slate-900 text-sm">{task.title}</h4>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">{task.description}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium ml-4">{task.time}</span>
                </div>
                <ChevronRight size={16} className="text-slate-300 self-center" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Quick Access */}
        <section>
          <h3 className="font-bold text-slate-800 mb-4">快捷入口</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setActiveTab('meeting')}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 group-active:scale-95 transition-transform">
                <Calendar size={24} />
              </div>
              <span className="font-bold text-slate-900 text-sm">会议预定</span>
              <span className="text-[10px] text-slate-400 mt-1">秒订空闲会议室</span>
            </button>
            <button 
              onClick={() => setActiveTab('approval')}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-3 group-active:scale-95 transition-transform">
                <FileCheck size={24} />
              </div>
              <span className="font-bold text-slate-900 text-sm">流程审批</span>
              <span className="text-[10px] text-slate-400 mt-1">一键发起审批</span>
            </button>
            <button 
              onClick={() => setActiveTab('document')}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-3 group-active:scale-95 transition-transform">
                <FileText size={24} />
              </div>
              <span className="font-bold text-slate-900 text-sm">文档查询</span>
              <span className="text-[10px] text-slate-400 mt-1">智能搜索知识库</span>
            </button>
            <button 
              onClick={() => setActiveTab('doc_admin')}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mb-3 group-active:scale-95 transition-transform">
                <Monitor size={24} />
              </div>
              <span className="font-bold text-slate-900 text-sm">文档管理</span>
              <span className="text-[10px] text-slate-400 mt-1">使用统计与维护</span>
            </button>
            <button 
              onClick={() => setActiveTab('attendance')}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3 group-active:scale-95 transition-transform">
                <Fingerprint size={24} />
              </div>
              <span className="font-bold text-slate-900 text-sm">请假打卡</span>
              <span className="text-[10px] text-slate-400 mt-1">智能考勤管理</span>
            </button>
            <button 
              onClick={() => setActiveTab('travel')}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-3 group-active:scale-95 transition-transform">
                <Plane size={24} />
              </div>
              <span className="font-bold text-slate-900 text-sm">差旅出行</span>
              <span className="text-[10px] text-slate-400 mt-1">智能推荐方案</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

const MeetingModule = ({ 
  setTasks, 
  setUserBookings, 
  userBookings,
  setNotification,
  onBack: onGlobalBack,
  selectedMeeting
}: { 
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>, 
  setUserBookings: React.Dispatch<React.SetStateAction<MeetingRoom[]>>,
  userBookings: MeetingRoom[],
  setNotification: React.Dispatch<React.SetStateAction<{ title: string; body: string } | null>>,
  onBack?: () => void,
  selectedMeeting?: MeetingRoom | null
}) => {
  const [view, setView] = useState<'list' | 'form' | 'recommendations' | 'details' | 'checkin' | 'admin_dashboard' | 'admin_room_details' | 'admin_rules'>('list');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showBookingConfirm, setShowBookingConfirm] = useState(false);
  const [showCheckinSuccess, setShowCheckinSuccess] = useState(false);
  const [showCheckinFailure, setShowCheckinFailure] = useState(false);
  const [checkinMethod, setCheckinMethod] = useState<'gps' | 'qr' | 'manual'>('gps');
  const [checkinStatus, setCheckinStatus] = useState<'idle' | 'checking' | 'success' | 'failure'>('idle');
  const [extensionStatus, setExtensionStatus] = useState<'idle' | 'checking' | 'success' | 'failure'>('idle');
  const [adminFilter, setAdminFilter] = useState<'all' | 'occupied' | 'available'>('all');
  const [adminSort, setAdminSort] = useState<'usage' | 'noshow'>('usage');
  const [selectedRoom, setSelectedRoom] = useState<MeetingRoom | null>(selectedMeeting || null);
  
  useEffect(() => {
    if (selectedMeeting) {
      setSelectedRoom(selectedMeeting);
      setView('details');
    }
  }, [selectedMeeting]);
  
  // Rule Configuration States
  const [ruleMinDuration, setRuleMinDuration] = useState('30 分钟');
  const [ruleMaxDuration, setRuleMaxDuration] = useState('4 小时');
  const [ruleEarliest, setRuleEarliest] = useState('7 天');
  const [ruleLatest, setRuleLatest] = useState('30 分钟');
  const [rulePriority, setRulePriority] = useState(0);
  const [rulePenalty, setRulePenalty] = useState(true);

  const [formStep, setFormStep] = useState(1);
  const [bookingInfo, setBookingInfo] = useState({
    date: '2026-04-11',
    start: '14:30',
    end: '15:30',
    capacity: 2,
    equipment: [] as string[],
    attendees: [] as string[],
  });

  const handleQuickBook = (room: MeetingRoom) => {
    setLoading(true);
    setSelectedRoom(room);
    
    // Simulate API call with potential failure
    setTimeout(() => {
      setLoading(false);
      if (room.name === 'C105') { 
        setShowFailure(true);
      } else {
        // Success Logic
        const now = new Date();
        const startTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const endHour = (now.getHours() + 1) % 24;
        const endTime = `${endHour.toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        setBookingInfo(prev => ({ ...prev, start: startTime, end: endTime }));
        
        // Add to user bookings
        setUserBookings(prev => [...prev, { ...room, status: 'booked' }]);
        
        // Add to tasks
        const newTask: Task = {
          id: `task-${Date.now()}`,
          title: "会议提醒",
          description: `${startTime} 会议室 ${room.name} 签到提醒`,
          time: startTime,
          type: 'meeting',
          status: 'pending',
          meetingRoomId: room.id
        };
        setTasks(prev => [newTask, ...prev]);
        
        // Trigger notification
        setNotification({
          title: '预订成功',
          body: `会议室 ${room.name} 已为您预订, 开始前 5 分钟将提醒您签到`
        });
        
        setShowSuccess(true);
      }
    }, 1500);
  };

  const handleConfirmBooking = () => {
    if (!selectedRoom) return;
    setLoading(true);
    setShowBookingConfirm(false);
    
    setTimeout(() => {
      setLoading(false);
      // Success Logic
      setUserBookings(prev => [...prev, { ...selectedRoom, status: 'booked' }]);
      
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: "会议提醒",
        description: `${bookingInfo.start} 会议室 ${selectedRoom.name} 签到提醒`,
        time: bookingInfo.start,
        type: 'meeting',
        status: 'pending',
        meetingRoomId: selectedRoom.id
      };
      setTasks(prev => [newTask, ...prev]);
      
      setNotification({
        title: '预订成功',
        body: `会议室 ${selectedRoom.name} 已预订成功`
      });
      
      setView('details');
    }, 1000);
  };

  const renderListView = () => (
    <div className="animate-in fade-in duration-300">
      <Header 
        title="会议预定" 
        showBack={MOCK_USER.role === 'admin' || !!onGlobalBack} 
        onBack={() => onGlobalBack ? onGlobalBack() : setView('admin_dashboard')} 
      />
      <div className="px-4 py-6">
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg tracking-tight">立即可用的会议室</h3>
              <p className="text-slate-400 text-xs mt-0.5">当前 30 分钟内空闲</p>
            </div>
          </div>
          <div className="space-y-4">
            {MOCK_ROOMS.filter(r => r.status === 'available').map((room) => (
              <motion.div 
                key={room.id}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">{room.name}</h4>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin size={14} className="text-slate-400" />
                        {room.floor} · {room.distance}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Users size={14} className="text-slate-400" />
                        {room.capacity}人
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleQuickBook(room)}
                    disabled={loading}
                    className="bg-brand-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-brand-200 active:scale-95 transition-transform disabled:opacity-50"
                  >
                    {loading && selectedRoom?.id === room.id ? '预订中...' : '立即预订'}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {room.equipment.map((eq, idx) => (
                    <span key={idx} className="bg-slate-50 text-slate-500 text-[10px] px-2 py-1 rounded-md font-medium border border-slate-100 flex items-center gap-1">
                      {eq === '投影仪' && <Monitor size={10} />}
                      {eq === '视频会议' && <Users size={10} />}
                      {eq}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">我的会议</h3>
            {MOCK_USER.role === 'admin' && (
              <button 
                onClick={() => setView('admin_dashboard')}
                className="text-brand-600 text-xs font-bold flex items-center gap-1"
              >
                管理看板 <ArrowRight size={14} />
              </button>
            )}
          </div>
          <div className="space-y-4">
            {userBookings.length > 0 ? (
              userBookings.map((room, idx) => (
                <motion.div 
                  key={idx}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setSelectedRoom(room); setView('details'); }}
                  className="bg-brand-50 border border-brand-100 rounded-2xl p-4 flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-600 shadow-sm">
                    <Calendar size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 text-sm">{room.name}</h4>
                    <p className="text-[10px] text-brand-600 font-bold mt-0.5">
                      {bookingInfo.start}-{bookingInfo.end} · {room.status === 'occupied' ? '进行中' : '待开始'}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-brand-300" />
                </motion.div>
              ))
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="text-slate-300" size={32} />
                </div>
                <p className="text-slate-400 text-sm">今日暂无预订会议</p>
                <button 
                  onClick={() => setView('form')}
                  className="mt-4 text-brand-600 font-bold text-sm flex items-center gap-1 mx-auto"
                >
                  <Plus size={18} />
                  预定新会议
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowSuccess(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-8 w-full max-w-sm relative z-10 text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={48} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">预订成功</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                已成功预订 {selectedRoom?.name}, <br />
                时间 {bookingInfo.start}-{bookingInfo.end}
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => { setShowSuccess(false); setView('details'); }}
                  className="w-full bg-brand-600 text-white py-3.5 rounded-2xl font-bold active:scale-95 transition-transform"
                >
                  查看详情
                </button>
                <button 
                  onClick={() => setShowSuccess(false)}
                  className="w-full bg-slate-50 text-slate-500 py-3.5 rounded-2xl font-bold active:scale-95 transition-transform"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Failure Modal */}
      <AnimatePresence>
        {showFailure && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowFailure(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-8 w-full max-w-sm relative z-10 text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={48} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">预订失败</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                抱歉, {selectedRoom?.name} 已被预订, <br />
                为您推荐其他会议室
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => { setShowFailure(false); setView('recommendations'); }}
                  className="w-full bg-brand-600 text-white py-3.5 rounded-2xl font-bold active:scale-95 transition-transform"
                >
                  查看推荐
                </button>
                <button 
                  onClick={() => setShowFailure(false)}
                  className="w-full bg-slate-50 text-slate-500 py-3.5 rounded-2xl font-bold active:scale-95 transition-transform"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderFormView = () => (
    <div className="animate-in slide-in-from-bottom duration-300 bg-white min-h-screen">
      <Header title="预定会议室" showBack onBack={() => setView('list')} />
      <div className="px-6 py-8 pb-32">
        <div className="space-y-8">
          {/* Step 1: Time */}
          <section>
            <label className="block text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-brand-600 text-white rounded-full flex items-center justify-center text-xs">1</span>
              选择会议时间
            </label>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">日期</span>
                <input 
                  type="date" 
                  value={bookingInfo.date}
                  onChange={(e) => setBookingInfo(prev => ({ ...prev, date: e.target.value }))}
                  className="bg-transparent border-none p-0 text-slate-900 font-bold w-full focus:ring-0" 
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">开始时间</span>
                  <input 
                    type="time" 
                    value={bookingInfo.start}
                    onChange={(e) => setBookingInfo(prev => ({ ...prev, start: e.target.value }))}
                    className="bg-transparent border-none p-0 text-slate-900 font-bold w-full focus:ring-0" 
                  />
                </div>
                <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">结束时间</span>
                  <input 
                    type="time" 
                    value={bookingInfo.end}
                    onChange={(e) => setBookingInfo(prev => ({ ...prev, end: e.target.value }))}
                    className="bg-transparent border-none p-0 text-slate-900 font-bold w-full focus:ring-0" 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Step 2: Capacity */}
          <section>
            <label className="block text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-brand-600 text-white rounded-full flex items-center justify-center text-xs">2</span>
              参会人数
            </label>
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <button 
                onClick={() => setBookingInfo(prev => ({ ...prev, capacity: Math.max(1, prev.capacity - 1) }))}
                className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-600 active:scale-90 transition-transform"
              >
                -
              </button>
              <div className="flex-1 text-center font-bold text-2xl text-slate-900">{bookingInfo.capacity}</div>
              <button 
                onClick={() => setBookingInfo(prev => ({ ...prev, capacity: Math.min(100, prev.capacity + 1) }))}
                className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-600 active:scale-90 transition-transform"
              >
                +
              </button>
            </div>
          </section>

          {/* Step 3: Equipment */}
          <section>
            <label className="block text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-brand-600 text-white rounded-full flex items-center justify-center text-xs">3</span>
              设备需求 (可选)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['投影仪', '视频会议系统', '白板', '茶歇服务'].map((item) => {
                const isSelected = bookingInfo.equipment.includes(item);
                return (
                  <button 
                    key={item} 
                    onClick={() => {
                      setBookingInfo(prev => ({
                        ...prev,
                        equipment: isSelected 
                          ? prev.equipment.filter(e => e !== item)
                          : [...prev.equipment, item]
                      }));
                    }}
                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                      isSelected ? 'bg-brand-50 border-brand-200 text-brand-700' : 'bg-slate-50 border-slate-100 text-slate-600'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                      isSelected ? 'bg-brand-600 border-brand-600 text-white' : 'bg-white border-slate-300'
                    }`}>
                      {isSelected && <CheckCircle2 size={14} />}
                    </div>
                    <span className="text-xs font-bold">{item}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Step 4: Attendees */}
          <section>
            <label className="block text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-brand-600 text-white rounded-full flex items-center justify-center text-xs">4</span>
              参会人员 (可选)
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="输入姓名搜索, 系统将计算中心点"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-sm focus:ring-2 focus:ring-brand-500 transition-all"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-600 p-1 active:scale-90 transition-transform">
                <Users size={18} />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 px-2">系统将根据参会人位置推荐距离中心点最近的会议室</p>
          </section>

          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md px-6 py-4 bg-white/80 backdrop-blur-md border-t border-slate-100 safe-bottom">
            <button 
              onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); setView('recommendations'); }, 1500); }}
              className="w-full bg-brand-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-brand-100 active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  推荐中...
                </>
              ) : '查看推荐'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRecommendations = () => {
    const recommendations = [
      { ...MOCK_ROOMS[0], reason: '容纳 8 人, 离参会人中心点 50 米, 有投影设备', best: true },
      { ...MOCK_ROOMS[1], reason: '容纳 12 人, 空间宽敞, 设备齐全', best: false },
      { ...MOCK_ROOMS[2], name: 'D402', floor: '4层', distance: '150米', capacity: 10, equipment: ['投影仪'], reason: '备选方案, 距离稍远', best: false },
    ];

    if (recommendations.length === 0) {
      return (
        <div className="animate-in slide-in-from-right duration-300 bg-white min-h-screen">
          <Header title="推荐结果" showBack onBack={() => setView('form')} />
          <div className="px-6 py-20 flex flex-col items-center text-center">
            <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mb-8">
              <AlertCircle size={64} className="text-slate-200" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">暂无可用会议室</h3>
            <p className="text-slate-500 text-sm mb-12">抱歉, 您选择的时间段暂无可用会议室<br />您可以尝试调整时间或人数</p>
            <button 
              onClick={() => setView('form')}
              className="w-full bg-brand-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-brand-100"
            >
              重新选择
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="animate-in slide-in-from-right duration-300 bg-slate-50 min-h-screen">
        <Header title={`为您推荐 ${recommendations.length} 个会议室`} showBack onBack={() => setView('form')} />
        <div className="px-4 py-6 space-y-4 pb-24">
          {recommendations.map((room, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden"
            >
              {room.best && (
                <div className="absolute top-0 right-0 bg-brand-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl shadow-sm">
                  最佳推荐
                </div>
              )}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-2xl font-bold text-slate-900">{room.name}</h4>
                  <p className="text-brand-600 text-xs font-bold mt-1.5 leading-relaxed">{room.reason}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                  <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                    <Clock size={14} />
                  </div>
                  {bookingInfo.start} - {bookingInfo.end}
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                  <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                    <MapPin size={14} />
                  </div>
                  {room.floor}
                </div>
              </div>
              <button 
                onClick={() => { setSelectedRoom(room as any); setShowBookingConfirm(true); }}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold active:scale-[0.98] transition-transform shadow-lg shadow-slate-100"
              >
                预订
              </button>
            </motion.div>
          ))}
          <button className="w-full py-4 text-slate-400 text-sm font-bold flex items-center justify-center gap-2">
            查看更多会议室
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Booking Confirmation Modal */}
        <AnimatePresence>
          {showBookingConfirm && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center px-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={() => setShowBookingConfirm(false)}
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-[32px] p-8 w-full max-w-sm relative z-10 shadow-2xl"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">确认预订 {selectedRoom?.name}?</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between py-3 border-b border-slate-50">
                    <span className="text-slate-400 text-sm">时间</span>
                    <span className="text-slate-900 font-bold text-sm">{bookingInfo.date} {bookingInfo.start}-{bookingInfo.end}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-50">
                    <span className="text-slate-400 text-sm">地点</span>
                    <span className="text-slate-900 font-bold text-sm">{selectedRoom?.floor}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-50">
                    <span className="text-slate-400 text-sm">参会人数</span>
                    <span className="text-slate-900 font-bold text-sm">{bookingInfo.capacity} 人</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowBookingConfirm(false)}
                    className="flex-1 bg-slate-50 text-slate-500 py-4 rounded-2xl font-bold active:scale-95 transition-transform"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleConfirmBooking}
                    className="flex-1 bg-brand-600 text-white py-4 rounded-2xl font-bold active:scale-95 transition-transform shadow-lg shadow-brand-100"
                  >
                    确认
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderDetails = () => (
    <div className="animate-in slide-in-from-right duration-300 bg-white min-h-screen">
      <Header title="会议详情" showBack onBack={() => setView('list')} />
      <div className="px-6 py-8 pb-32">
        {/* Status Badge */}
        <div className="mb-6">
          {checkinStatus === 'success' ? (
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-xs font-bold border border-emerald-100">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              会议进行中 · 距离结束还有 58 分钟
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-2 rounded-full text-xs font-bold border border-amber-100">
              <Clock size={14} />
              待签到 · 请在 14:40 前完成签到
            </div>
          )}
        </div>

        {/* Simulation Buttons (Demo Only) */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button 
            onClick={() => setNotification({ title: '会议室 A303 签到提醒', body: '您预订的会议室将在 5 分钟后开始, 请及时签到' })}
            className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full font-bold hover:bg-slate-200 transition-colors"
          >
            模拟 5min 提醒
          </button>
          <button 
            onClick={simulateTimeout}
            className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full font-bold hover:bg-slate-200 transition-colors"
          >
            模拟超时释放
          </button>
        </div>

        <div className="bg-slate-50 rounded-3xl p-6 mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">{selectedRoom?.name || 'A303'}</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">时间</p>
                <p className="text-sm font-bold text-slate-900">2026-04-11 {bookingInfo.start}-{bookingInfo.end}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">地点</p>
                <p className="text-sm font-bold text-slate-900">1 号楼 3 层</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                <Users size={20} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">容量</p>
                <p className="text-sm font-bold text-slate-900">8 人</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                <Monitor size={20} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">设备</p>
                <p className="text-sm font-bold text-slate-900">投影仪、视频会议系统</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Visual */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-slate-900 mb-4">位置导航</h3>
          <div className="aspect-video bg-slate-100 rounded-3xl relative overflow-hidden flex items-center justify-center border border-slate-200">
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-6 grid-rows-4 h-full w-full">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="border border-slate-400"></div>
                ))}
              </div>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">
                <MapPin size={16} />
              </div>
              <span className="text-[10px] font-bold text-slate-600 mt-2 bg-white px-2 py-1 rounded-full shadow-sm">1号楼 3层 A303</span>
            </div>
            <button className="absolute bottom-4 right-4 bg-white p-2 rounded-xl shadow-md text-brand-600 active:scale-95 transition-transform">
              一键导航
            </button>
          </div>
        </div>

        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-md px-4 py-4 bg-white/90 backdrop-blur-md border-t border-slate-100 safe-bottom z-40">
          <div className="space-y-3">
            {checkinStatus !== 'success' && (
              <button 
                onClick={() => setView('checkin')}
                className="w-full bg-brand-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-100 active:scale-[0.98] transition-transform"
              >
                <Fingerprint size={20} />
                立即签到
              </button>
            )}
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setShowExtendModal(true)}
                className="bg-white border border-slate-200 text-slate-700 py-3 rounded-xl text-xs font-bold active:bg-slate-50 transition-colors truncate px-1"
              >
                延长会议
              </button>
              <button 
                onClick={() => setShowEndConfirm(true)}
                className="bg-white border border-slate-200 text-slate-700 py-3 rounded-xl text-xs font-bold active:bg-slate-50 transition-colors truncate px-1"
              >
                提前结束
              </button>
              <button 
                onClick={() => setShowCancelConfirm(true)}
                className="bg-white border border-red-100 text-red-500 py-3 rounded-xl text-xs font-bold active:bg-red-50 transition-colors truncate px-1"
              >
                取消预订
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Extend Modal */}
      <AnimatePresence>
        {showExtendModal && (
          <div className="fixed inset-0 z-[70] flex items-end justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowExtendModal(false)}
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white rounded-t-[40px] p-8 w-full max-w-md relative z-10 shadow-2xl safe-bottom"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">延长会议时间</h3>
              <p className="text-slate-400 text-sm mb-8">延长会议需检查会议室后续是否有预订</p>
              <div className="space-y-3 mb-8">
                {[
                  { label: '+30 分钟', minutes: 30, time: '新结束时间: 16:00' },
                  { label: '+1 小时', minutes: 60, time: '新结束时间: 16:30' },
                  { label: '自定义', minutes: 0, time: '弹出时间选择器' },
                ].map((opt, i) => (
                  <button 
                    key={i} 
                    onClick={() => opt.minutes > 0 ? handleExtendMeeting(opt.minutes) : null}
                    disabled={extensionStatus === 'checking'}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${
                      extensionStatus === 'checking' ? 'opacity-50 cursor-not-allowed' : 'active:bg-brand-50 active:border-brand-200'
                    } border-slate-100 bg-slate-50`}
                  >
                    <div className="flex items-center gap-3">
                      {extensionStatus === 'checking' && opt.minutes > 0 && (
                        <div className="w-4 h-4 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                      )}
                      <span className="font-bold text-slate-900">{opt.label}</span>
                    </div>
                    <span className="text-xs text-slate-400">{opt.time}</span>
                  </button>
                ))}
              </div>
              {extensionStatus === 'failure' && (
                <div className="mb-6 p-4 bg-red-50 rounded-2xl border border-red-100">
                  <p className="text-xs text-red-600 leading-relaxed">
                    抱歉, 会议室 16:00 后已被预订, 无法延长。您可以预订其他会议室继续会议。
                  </p>
                </div>
              )}
              <button 
                onClick={() => setShowExtendModal(false)}
                className="w-full bg-slate-100 text-slate-500 py-4 rounded-2xl font-bold active:scale-95 transition-transform"
              >
                返回
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* End Confirmation */}
      <AnimatePresence>
        {showEndConfirm && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowEndConfirm(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 w-full max-w-sm relative z-10 text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">确认提前结束会议?</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                会议室将立即释放, 其他人可预订
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowEndConfirm(false)}
                  className="flex-1 bg-slate-50 text-slate-500 py-3.5 rounded-2xl font-bold active:scale-95 transition-transform"
                >
                  取消
                </button>
                <button 
                  onClick={handleEndEarly}
                  className="flex-1 bg-brand-600 text-white py-3.5 rounded-2xl font-bold active:scale-95 transition-transform"
                >
                  确认结束
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cancel Confirmation */}
      <AnimatePresence>
        {showCancelConfirm && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowCancelConfirm(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 w-full max-w-sm relative z-10 text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">确认取消预订?</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                取消后会议室将释放, 确认取消?
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 bg-slate-50 text-slate-500 py-3.5 rounded-2xl font-bold active:scale-95 transition-transform"
                >
                  返回
                </button>
                <button 
                  onClick={() => { setShowCancelConfirm(false); setView('list'); }}
                  className="flex-1 bg-red-500 text-white py-3.5 rounded-2xl font-bold active:scale-95 transition-transform"
                >
                  确认取消
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  const handleExtendMeeting = (minutes: number) => {
    setExtensionStatus('checking');
    
    setTimeout(() => {
      // Simulate availability check
      // If room is A303 and we try to extend by 60 mins, simulate failure
      if (selectedRoom?.name === 'A303' && minutes === 60) {
        setExtensionStatus('failure');
        setNotification({
          title: '延长失败',
          body: `抱歉, 会议室 ${selectedRoom.name} 16:00 后已被预订, 无法延长`
        });
      } else {
        setExtensionStatus('success');
        const [h, m] = bookingInfo.end.split(':').map(Number);
        const newTotalMinutes = h * 60 + m + minutes;
        const newH = Math.floor(newTotalMinutes / 60) % 24;
        const newM = newTotalMinutes % 60;
        const newEndTime = `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
        
        setBookingInfo(prev => ({ ...prev, end: newEndTime }));
        setNotification({
          title: '延长成功',
          body: `会议已延长至 ${newEndTime}`
        });
        setShowExtendModal(false);
      }
    }, 1000);
  };

  const handleEndEarly = () => {
    setShowEndConfirm(false);
    
    // Remove from userBookings
    setUserBookings(prev => prev.filter(r => r.id !== selectedRoom?.id));
    
    setNotification({
      title: '会议已结束',
      body: `会议室 ${selectedRoom?.name || 'A303'} 已释放, 感谢您的配合`
    });

    // Waitlist Simulation
    if (selectedRoom?.name === 'A303') {
      setTimeout(() => {
        setNotification({
          title: '候补通知',
          body: `您关注的会议室 ${selectedRoom.name} 已提前释放, 立即点击预订`
        });
      }, 3000);
    }

    setView('list');
  };

  const handleCheckIn = () => {
    setCheckinStatus('checking');
    
    setTimeout(() => {
      if (checkinMethod === 'gps') {
        // Simulate GPS failure for demo if room name is C105
        if (selectedRoom?.name === 'C105') {
          setCheckinStatus('failure');
          setShowCheckinFailure(true);
        } else {
          setCheckinStatus('success');
          setShowCheckinSuccess(true);
          // Update room status in userBookings
          setUserBookings(prev => prev.map(r => r.id === selectedRoom?.id ? { ...r, status: 'occupied' } : r));
          if (selectedRoom) setSelectedRoom({ ...selectedRoom, status: 'occupied' });
        }
      } else {
        setCheckinStatus('success');
        setShowCheckinSuccess(true);
        // Update room status in userBookings
        setUserBookings(prev => prev.map(r => r.id === selectedRoom?.id ? { ...r, status: 'occupied' } : r));
        if (selectedRoom) setSelectedRoom({ ...selectedRoom, status: 'occupied' });
      }
    }, 1500);
  };

  const simulateTimeout = () => {
    setNotification({
      title: '会议室即将释放',
      body: `会议室 ${selectedRoom?.name || 'A303'} 超时未签到, 如需继续使用请立即签到, 否则将在 5 分钟后释放`
    });
    
    // Simulate auto-release after 5 more minutes (simulated as 5 seconds here)
    setTimeout(() => {
      setNotification({
        title: '会议室已自动释放',
        body: `会议室 ${selectedRoom?.name || 'A303'} 因超时未签到已自动释放`
      });
      // Also notify admin
      console.log('Admin Notification: 会议室 A303 因超时未签到已自动释放');
      setCheckinStatus('idle');
      setUserBookings(prev => prev.filter(r => r.id !== selectedRoom?.id));
      setView('list');
    }, 5000);
  };

  const renderCheckIn = () => (
    <div className="animate-in slide-in-from-bottom duration-300 bg-white min-h-screen">
      <Header title="会议签到" showBack onBack={() => setView('details')} />
      <div className="px-6 py-8 pb-32">
        {/* Meeting Info Card */}
        <div className="bg-slate-50 rounded-3xl p-6 mb-8 border border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-brand-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-brand-100">
              <Calendar size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{selectedRoom?.name || 'A303'}</h3>
              <p className="text-xs text-slate-500 font-medium">1 号楼 3 层</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">时间</span>
              <span className="text-slate-900 font-bold">{bookingInfo.date} {bookingInfo.start}-{bookingInfo.end}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">预订人</span>
              <span className="text-slate-900 font-bold">{MOCK_USER.name}</span>
            </div>
          </div>
        </div>

        {/* Check-in Methods */}
        <div className="space-y-4 mb-12">
          <h3 className="text-sm font-bold text-slate-900 px-1">选择签到方式</h3>
          {[
            { id: 'gps', label: 'GPS 定位签到', desc: '自动检测是否在会议室 50 米内', icon: <MapPin size={20} /> },
            { id: 'qr', label: '扫描二维码签到', desc: '扫描会议室门口的签到二维码', icon: <QrCode size={20} /> },
            { id: 'manual', label: '手动签到', desc: '需管理员权限或特殊情况使用', icon: <Fingerprint size={20} /> },
          ].map((method) => (
            <button 
              key={method.id}
              onClick={() => setCheckinMethod(method.id as any)}
              className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all text-left ${
                checkinMethod === method.id 
                  ? 'bg-brand-50 border-brand-200 ring-2 ring-brand-100' 
                  : 'bg-white border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                checkinMethod === method.id ? 'bg-brand-600 text-white' : 'bg-slate-50 text-slate-400'
              }`}>
                {method.icon}
              </div>
              <div className="flex-1">
                <p className={`font-bold text-sm ${checkinMethod === method.id ? 'text-brand-900' : 'text-slate-900'}`}>
                  {method.label}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">{method.desc}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                checkinMethod === method.id ? 'border-brand-600' : 'border-slate-200'
              }`}>
                {checkinMethod === method.id && <div className="w-2.5 h-2.5 bg-brand-600 rounded-full" />}
              </div>
            </button>
          ))}
        </div>

        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md px-6 py-4 bg-white/90 backdrop-blur-md border-t border-slate-100 safe-bottom">
          <button 
            onClick={handleCheckIn}
            disabled={checkinStatus === 'checking'}
            className="w-full bg-brand-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-brand-100 active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {checkinStatus === 'checking' ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                签到中...
              </>
            ) : '立即签到'}
          </button>
        </div>
      </div>

      {/* Check-in Success Modal */}
      <AnimatePresence>
        {showCheckinSuccess && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 w-full max-w-sm relative z-10 text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">签到成功</h3>
              <p className="text-slate-500 text-sm mb-8">签到成功, 祝您会议顺利</p>
              <button 
                onClick={() => { setShowCheckinSuccess(false); setView('details'); setCheckinStatus('success'); }}
                className="w-full bg-brand-600 text-white py-4 rounded-2xl font-bold active:scale-95 transition-transform"
              >
                进入会议
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Check-in Failure Modal */}
      <AnimatePresence>
        {showCheckinFailure && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 w-full max-w-sm relative z-10 text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={48} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">签到失败</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                您距离会议室较远, <br />
                请确认您已到达会议室
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => { setShowCheckinFailure(false); setCheckinStatus('idle'); }}
                  className="w-full bg-brand-600 text-white py-3.5 rounded-2xl font-bold active:scale-95 transition-transform"
                >
                  重新签到
                </button>
                <button 
                  onClick={() => { setShowCheckinFailure(false); setCheckinMethod('manual'); setCheckinStatus('idle'); }}
                  className="w-full bg-slate-50 text-slate-500 py-3.5 rounded-2xl font-bold active:scale-95 transition-transform"
                >
                  手动签到
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderAdminDashboard = () => {
    const filteredRooms = MOCK_ROOMS
      .filter(r => adminFilter === 'all' || (adminFilter === 'occupied' ? r.status === 'occupied' : r.status === 'available'))
      .sort((a, b) => adminSort === 'usage' ? 0.7 - 0.6 : 2 - 1); // Mock sort

    return (
      <div className="animate-in slide-in-from-left duration-300 bg-slate-50 min-h-screen">
        <Header title="会议室资源看板" showBack onBack={() => setView('list')} />
        <div className="px-4 py-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">今日会议室</p>
              <p className="text-2xl font-bold text-slate-900">50 <span className="text-xs text-slate-400 font-normal">个</span></p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">当前占用</p>
              <p className="text-2xl font-bold text-brand-600">30 <span className="text-xs text-slate-400 font-normal">个 (60%)</span></p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">当前空闲</p>
              <p className="text-2xl font-bold text-emerald-500">20 <span className="text-xs text-slate-400 font-normal">个 (40%)</span></p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">今日爽约</p>
              <p className="text-2xl font-bold text-red-500">5 <span className="text-xs text-slate-400 font-normal">次</span></p>
            </div>
          </div>

          {/* Filter & Sort Bar */}
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex gap-2">
              {(['all', 'occupied', 'available'] as const).map((f) => (
                <button 
                  key={f}
                  onClick={() => setAdminFilter(f)}
                  className={`text-[10px] px-3 py-1.5 rounded-full font-bold transition-colors ${
                    adminFilter === f ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 border border-slate-100'
                  }`}
                >
                  {f === 'all' ? '全部' : f === 'occupied' ? '占用' : '空闲'}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setAdminSort(adminSort === 'usage' ? 'noshow' : 'usage')}
              className="text-[10px] text-slate-500 font-bold flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-slate-100"
            >
              按{adminSort === 'usage' ? '使用率' : '爽约次数'}排序
            </button>
          </div>

          {/* Room List */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-50 flex items-center justify-between">
              <h4 className="font-bold text-slate-900">会议室列表</h4>
              <button className="text-slate-400"><Search size={18} /></button>
            </div>
            <div className="divide-y divide-slate-50">
              {filteredRooms.map((room) => (
                <div key={room.id} className="p-5 flex items-center justify-between active:bg-slate-50 transition-colors" onClick={() => { setSelectedRoom(room); setView('admin_room_details'); }}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      room.status === 'available' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'
                    }`}>
                      <Monitor size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{room.name}</p>
                      <p className="text-[10px] text-slate-400">{room.floor} · 使用率 70%</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      room.status === 'available' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {room.status === 'available' ? '空闲' : '占用'}
                    </span>
                    <p className="text-[10px] text-red-400 mt-1">爽约 2 次</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAdminRoomDetails = () => (
    <div className="animate-in slide-in-from-right duration-300 bg-white min-h-screen">
      <Header title={`${selectedRoom?.name || 'A303'} 详情`} showBack onBack={() => setView('admin_dashboard')} />
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">{selectedRoom?.name}</h2>
            <p className="text-slate-400 text-sm mt-1">{selectedRoom?.floor} · {selectedRoom?.capacity}人 · {selectedRoom?.equipment.join('、')}</p>
          </div>
          <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl text-sm font-bold">空闲中</div>
        </div>

        <section className="mb-10">
          <h3 className="font-bold text-slate-900 mb-4">今日使用情况</h3>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-4">
            {[
              { time: '09:00', user: '张三', status: 'used' },
              { time: '10:00', user: null, status: 'free' },
              { time: '11:00', user: '李四', status: 'booked' },
              { time: '12:00', user: '王五', status: 'noshow' },
              { time: '13:00', user: null, status: 'free' },
            ].map((slot, idx) => (
              <div key={idx} className="flex-shrink-0 w-24 text-center">
                <div className={`h-12 rounded-xl mb-2 flex items-center justify-center border ${
                  slot.status === 'used' ? 'bg-slate-100 border-slate-200 text-slate-400' :
                  slot.status === 'booked' ? 'bg-brand-50 border-brand-200 text-brand-600' :
                  slot.status === 'noshow' ? 'bg-red-50 border-red-200 text-red-500' :
                  'bg-emerald-50 border-emerald-200 text-emerald-600'
                }`}>
                  <span className="text-[10px] font-bold">{slot.time}</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium truncate px-1">{slot.user || '空闲'}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">使用率</p>
              <p className="text-lg font-bold text-slate-900">70%</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">爽约</p>
              <p className="text-lg font-bold text-red-500">2 次</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">平均时长</p>
              <p className="text-lg font-bold text-slate-900">1.5h</p>
            </div>
          </div>
        </section>

        <div className="space-y-4">
          <button 
            onClick={() => setView('admin_rules')}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
          >
            <Monitor size={20} />
            设置规则
          </button>
          <button className="w-full bg-white border border-slate-200 text-slate-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
            <FileText size={20} />
            导出报表
          </button>
        </div>
      </div>
    </div>
  );

  const renderAdminRules = () => (
    <div className="animate-in slide-in-from-bottom duration-300 bg-white min-h-screen">
      <Header title={`${selectedRoom?.name || 'A303'} 规则配置`} showBack onBack={() => setView('admin_room_details')} />
      <div className="px-6 py-8 space-y-8 pb-32">
        <section>
          <h3 className="text-sm font-bold text-slate-900 mb-4">可预订时长</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setRuleMinDuration(prev => prev === '30 分钟' ? '15 分钟' : '30 分钟')}
              className="bg-slate-50 p-4 rounded-2xl border border-brand-200 bg-brand-50 text-left active:scale-95 transition-transform"
            >
              <span className="text-[10px] text-brand-400 font-bold uppercase block mb-1">最短时长</span>
              <p className="font-bold text-brand-900">{ruleMinDuration}</p>
            </button>
            <button 
              onClick={() => setRuleMaxDuration(prev => prev === '4 小时' ? '8 小时' : '4 小时')}
              className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left active:scale-95 transition-transform"
            >
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">最长时长</span>
              <p className="font-bold text-slate-900">{ruleMaxDuration}</p>
            </button>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold text-slate-900 mb-4">提前预订时间</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setRuleEarliest(prev => prev === '7 天' ? '14 天' : '7 天')}
              className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left active:scale-95 transition-transform"
            >
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">最早提前</span>
              <p className="font-bold text-slate-900">{ruleEarliest}</p>
            </button>
            <button 
              onClick={() => setRuleLatest(prev => prev === '30 分钟' ? '1 小时' : '30 分钟')}
              className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left active:scale-95 transition-transform"
            >
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">最晚提前</span>
              <p className="font-bold text-slate-900">{ruleLatest}</p>
            </button>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold text-slate-900 mb-4">优先级规则</h3>
          <div className="space-y-3">
            {['默认: 所有员工可预订', '限制: 仅限部门 A、部门 B 可预订', '高级: 仅限总监级及以上可预订'].map((rule, idx) => (
              <button 
                key={idx} 
                onClick={() => setRulePriority(idx)}
                className={`w-full text-left p-5 rounded-2xl border transition-all ${rulePriority === idx ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-100' : 'border-slate-100 bg-slate-50 text-slate-600'} font-bold text-sm`}
              >
                {rule}
              </button>
            ))}
          </div>
        </section>

        <section className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900">爽约惩罚</h3>
            <button 
              onClick={() => setRulePenalty(!rulePenalty)}
              className={`w-12 h-6 rounded-full relative transition-colors ${rulePenalty ? 'bg-brand-600' : 'bg-slate-300'}`}
            >
              <motion.div 
                animate={{ x: rulePenalty ? 24 : 4 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" 
              />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
            {rulePenalty ? '已开启: 连续爽约 3 次, 禁止预订 7 天' : '已关闭: 不执行爽约惩罚'}
          </p>
        </section>

        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-6 bg-white/90 backdrop-blur-md border-t border-slate-100 safe-bottom">
          <button 
            onClick={() => { 
              setLoading(true); 
              setTimeout(() => { 
                setLoading(false); 
                setNotification({ title: '配置已保存', body: `${selectedRoom?.name} 的规则已成功更新` });
                setView('admin_room_details'); 
              }, 1000); 
            }}
            className="w-full bg-brand-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-brand-100 active:scale-95 transition-transform"
          >
            保存配置
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pb-24">
      {view === 'list' && renderListView()}
      {view === 'form' && renderFormView()}
      {view === 'recommendations' && renderRecommendations()}
      {view === 'details' && renderDetails()}
      {view === 'checkin' && renderCheckIn()}
      {view === 'admin_dashboard' && renderAdminDashboard()}
      {view === 'admin_room_details' && renderAdminRoomDetails()}
      {view === 'admin_rules' && renderAdminRules()}
    </div>
  );
};

const ApprovalModule = ({ 
  approvals, 
  setApprovals, 
  setNotification,
  setActiveTab: setGlobalTab
}: { 
  approvals: Approval[], 
  setApprovals: React.Dispatch<React.SetStateAction<Approval[]>>,
  setNotification: React.Dispatch<React.SetStateAction<{ 
    title: string; 
    body: string; 
    actionLabel?: string; 
    onAction?: () => void 
  } | null>>,
  setActiveTab: (tab: TabType) => void
}) => {
  const [view, setView] = useState<'list' | 'leave_form' | 'details'>('list');
  const [activeTab, setActiveTab] = useState<'mine' | 'pending' | 'cc'>('mine');
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [isTimeout, setIsTimeout] = useState(false);
  const [showRemindConfirm, setShowRemindConfirm] = useState(false);
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);
  
  // Manager Approval States
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [selectedBatchIds, setSelectedBatchIds] = useState<string[]>([]);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [approvalComment, setApprovalComment] = useState('');
  
  const [leaveForm, setLeaveForm] = useState({
    type: '年假',
    startDate: '2026-04-13',
    endDate: '2026-04-15',
    reason: '',
    attachment: null as File | null
  });

  const annualLeaveBalance = 10;
  const calculateDays = () => {
    const start = new Date(leaveForm.startDate);
    const end = new Date(leaveForm.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleSubmitLeave = () => {
    const days = calculateDays();
    if (leaveForm.type === '年假' && days > annualLeaveBalance) {
      setNotification({
        title: '提交失败',
        body: '您的年假余额不足, 请调整请假天数或选择其他假期类型'
      });
      return;
    }

    const newApproval: Approval = {
      id: `a-${Date.now()}`,
      type: 'leave',
      title: `${leaveForm.type}申请`,
      initiator: MOCK_USER.name,
      time: new Date().toLocaleString('zh-CN', { hour12: false }),
      status: 'pending',
      content: { ...leaveForm, days }
    };

    setApprovals(prev => [newApproval, ...prev]);
    setNotification({
      title: '提交成功',
      body: '请假申请已提交, 等待审批'
    });
    setSelectedApproval(newApproval);
    setView('details');
  };

  const handleRemind = () => {
    setShowRemindConfirm(false);
    setNotification({
      title: '催办成功',
      body: '已催办, 请耐心等待。系统已推送提醒给审批人李四。'
    });
  };

  const handleRevoke = () => {
    if (!selectedApproval) return;
    setShowRevokeConfirm(false);
    setApprovals(prev => prev.map(a => a.id === selectedApproval.id ? { ...a, status: 'rejected' as const } : a));
    setNotification({
      title: '撤销成功',
      body: '该申请已撤销'
    });
    setView('list');
  };

  const handleApprove = () => {
    if (!selectedApproval) return;
    setShowApproveConfirm(false);
    setApprovals(prev => prev.map(a => a.id === selectedApproval.id ? { ...a, status: 'approved' as const } : a));
    
    if (selectedApproval.type === 'trip') {
      setNotification({
        title: '您的出差申请已通过',
        body: '审批已通过, 可以开始订票了',
        actionLabel: '立即订票',
        onAction: () => setGlobalTab('travel')
      });
    } else {
      setNotification({
        title: '审批成功',
        body: '您的请假申请已通过第一级审批'
      });
    }
    setView('list');
  };

  const handleReject = () => {
    if (!selectedApproval || !rejectReason) return;
    setShowRejectDialog(false);
    setApprovals(prev => prev.map(a => a.id === selectedApproval.id ? { ...a, status: 'rejected' as const } : a));
    setNotification({
      title: '审批已拒绝',
      body: `您的请假申请已被拒绝, 原因: ${rejectReason}`
    });
    setRejectReason('');
    setView('list');
  };

  const handleBatchApprove = () => {
    setApprovals(prev => prev.map(a => selectedBatchIds.includes(a.id) ? { ...a, status: 'approved' as const } : a));
    setNotification({
      title: '批量审批成功',
      body: `已批量通过 ${selectedBatchIds.length} 条审批`
    });
    setIsBatchMode(false);
    setSelectedBatchIds([]);
  };

  const toggleBatchSelect = (id: string) => {
    setSelectedBatchIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const renderList = () => (
    <div className="pb-24 animate-in slide-in-from-right duration-300">
      <Header title="流程审批" showBack onBack={() => setGlobalTab('home')} />
      
      <div className="px-4 py-6">
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: '请假', icon: Coffee, color: 'bg-orange-50 text-orange-600', action: () => setView('leave_form') },
            { label: '出差', icon: Plane, color: 'bg-blue-50 text-blue-600', action: () => { setNotification({ title: '跳转中', body: '正在为您跳转至差旅模块...' }); setView('list'); /* In a real app this would change parent state */ } },
            { label: '报销', icon: FileCheck, color: 'bg-emerald-50 text-emerald-600' },
            { label: '更多', icon: MoreHorizontal, color: 'bg-slate-50 text-slate-600' },
          ].map((item, idx) => (
            <button key={idx} onClick={item.action} className="flex flex-col items-center gap-2">
              <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center shadow-sm active:scale-90 transition-transform`}>
                <item.icon size={24} />
              </div>
              <span className="text-xs font-medium text-slate-600">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="flex border-b border-slate-100 mb-6">
          {[
            { id: 'mine', label: '我发起的' },
            { id: 'pending', label: '待我审批' },
            { id: 'cc', label: '抄送我的' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setIsBatchMode(false);
                setSelectedBatchIds([]);
              }}
              className={`flex-1 pb-3 text-sm font-bold transition-colors relative ${
                activeTab === tab.id ? 'text-brand-600' : 'text-slate-400'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600"
                />
              )}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {activeTab === 'pending' && approvals.filter(a => a.status === 'pending').length > 0 && (
            <div className="flex justify-end mb-2">
              <button 
                onClick={() => setIsBatchMode(!isBatchMode)}
                className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1.5 rounded-lg"
              >
                {isBatchMode ? '取消选择' : '批量审批'}
              </button>
            </div>
          )}
          {approvals
            .filter(a => {
              if (activeTab === 'mine') return a.initiator === MOCK_USER.name;
              if (activeTab === 'pending') return a.status === 'pending';
              return true;
            })
            .map((approval) => (
            <motion.div 
              key={approval.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (isBatchMode && activeTab === 'pending') {
                  toggleBatchSelect(approval.id);
                } else {
                  setSelectedApproval(approval); 
                  setView('details');
                }
              }}
              className={`bg-white rounded-2xl p-4 border transition-all shadow-sm relative ${
                selectedBatchIds.includes(approval.id) ? 'border-brand-600 bg-brand-50/30' : 'border-slate-100'
              }`}
            >
              {isBatchMode && activeTab === 'pending' && (
                <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  selectedBatchIds.includes(approval.id) ? 'bg-brand-600 border-brand-600' : 'border-slate-200 bg-white'
                }`}>
                  {selectedBatchIds.includes(approval.id) && <Check size={12} className="text-white" />}
                </div>
              )}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${
                    approval.type === 'leave' ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'
                  }`}>
                    {approval.type === 'leave' ? <Coffee size={18} /> : <Plane size={18} />}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{approval.title}</h4>
                </div>
                {!isBatchMode && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    approval.status === 'pending' ? 'bg-amber-50 text-amber-600' : 
                    approval.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 
                    'bg-red-50 text-red-600'
                  }`}>
                    {approval.status === 'pending' ? '审批中' : 
                     approval.status === 'approved' ? '已通过' : '已拒绝'}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>发起人: {approval.initiator}</span>
                <span>{approval.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Batch Action Bar */}
      <AnimatePresence>
        {isBatchMode && selectedBatchIds.length > 0 && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md px-6 py-4 bg-white/90 backdrop-blur-md border-t border-slate-100 z-50 flex items-center justify-between shadow-2xl"
          >
            <span className="text-sm font-bold text-slate-600">已选择 {selectedBatchIds.length} 条</span>
            <button 
              onClick={handleBatchApprove}
              className="bg-brand-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-brand-100 active:scale-95 transition-transform"
            >
              批量通过
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderLeaveForm = () => (
    <div className="animate-in slide-in-from-right duration-300 bg-white min-h-screen">
      <Header title="请假申请" showBack onBack={() => setView('list')} />
      <div className="px-6 py-8 pb-32">
        <div className="space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">第一步: 请假类型</h3>
              <span className="text-[10px] text-brand-600 font-bold bg-brand-50 px-2 py-0.5 rounded-full">智能推荐: 年假</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['年假', '病假', '事假', '调休'].map((type) => (
                <button 
                  key={type}
                  onClick={() => setLeaveForm(prev => ({ ...prev, type }))}
                  className={`p-4 rounded-2xl border text-sm font-bold transition-all ${
                    leaveForm.type === type ? 'border-brand-600 bg-brand-50 text-brand-600' : 'border-slate-100 bg-slate-50 text-slate-500'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">第二步: 请假时间</h3>
              <span className="text-[10px] text-slate-400 font-medium">共 {calculateDays()} 天</span>
            </div>
            <div className="space-y-3">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-bold">开始日期</span>
                <input 
                  type="date" 
                  value={leaveForm.startDate}
                  onChange={(e) => setLeaveForm(prev => ({ ...prev, startDate: e.target.value }))}
                  className="bg-transparent text-sm font-bold text-slate-900 outline-none"
                />
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-bold">结束日期</span>
                <input 
                  type="date" 
                  value={leaveForm.endDate}
                  onChange={(e) => setLeaveForm(prev => ({ ...prev, endDate: e.target.value }))}
                  className="bg-transparent text-sm font-bold text-slate-900 outline-none"
                />
              </div>
            </div>
            {leaveForm.type === '年假' && (
              <p className="text-[10px] text-brand-600 mt-3 font-medium">
                您的年假余额为 {annualLeaveBalance} 天, 本次请假后剩余 {annualLeaveBalance - calculateDays()} 天
              </p>
            )}
          </section>

          <section>
            <h3 className="text-sm font-bold text-slate-900 mb-4">第三步: 请假事由</h3>
            <div className="relative">
              <textarea 
                placeholder="请输入请假事由..."
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm(prev => ({ ...prev, reason: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm min-h-[120px] outline-none focus:border-brand-200 transition-colors"
              />
              <div className="absolute bottom-4 right-4 text-slate-300">
                <Wifi size={18} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {(leaveForm.type === '病假' ? ['身体不适', '感冒发烧', '预约就诊'] : ['家中有事', '个人原因', '外出办事']).map((s) => (
                <button 
                  key={s}
                  onClick={() => setLeaveForm(prev => ({ ...prev, reason: s }))}
                  className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full font-bold hover:bg-slate-200 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </section>

          {leaveForm.type === '病假' && (
            <section className="animate-in fade-in slide-in-from-top duration-300">
              <h3 className="text-sm font-bold text-slate-900 mb-4">第四步: 附件上传</h3>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-slate-50">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm">
                  <Plus size={24} />
                </div>
                <p className="text-xs text-slate-400 font-medium">请上传病假条或诊断证明</p>
              </div>
            </section>
          )}

          <div className="pt-4">
            <button 
              onClick={handleSubmitLeave}
              className="w-full bg-brand-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-brand-100 active:scale-95 transition-transform"
            >
              提交审批
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDetails = () => (
    <div className="animate-in slide-in-from-right duration-300 bg-slate-50 min-h-screen relative">
      <Header 
        title={
          activeTab === 'pending' 
            ? (selectedApproval?.title.includes('报销') ? "审批出差报销申请" : 
               selectedApproval?.title.includes('补卡') ? "审批补卡申请" : "审批请假申请") 
            : "审批详情"
        } 
        showBack 
        onBack={() => setView('list')} 
      />
      
      <div className="px-4 py-6 pb-48">
        {selectedApproval && (
          <div className="space-y-6">
            {/* Simulation Control (Only for initiator view) */}
            {selectedApproval.initiator === MOCK_USER.name && (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-700">演示: 模拟审批超时 (24h)</span>
                <button 
                  onClick={() => setIsTimeout(!isTimeout)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${isTimeout ? 'bg-amber-500' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${isTimeout ? 'left-5.5' : 'left-0.5'}`} />
                </button>
              </div>
            )}

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    selectedApproval.type === 'leave' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {selectedApproval.type === 'leave' ? <Coffee size={24} /> : <Plane size={24} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{selectedApproval.title}</h3>
                    <p className="text-xs text-slate-400">{selectedApproval.time}</p>
                  </div>
                </div>
                <div className={`text-xs px-3 py-1.5 rounded-full font-bold ${
                  selectedApproval.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                  selectedApproval.status === 'rejected' ? 'bg-red-50 text-red-600' :
                  'bg-amber-50 text-amber-600'
                }`}>
                  {selectedApproval.status === 'approved' ? '已通过' :
                   selectedApproval.status === 'rejected' ? '已拒绝' : '进行中'}
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-50">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase">发起人</span>
                  <span className="text-sm font-bold text-slate-900">{selectedApproval.initiator}</span>
                </div>
                {selectedApproval.content && Object.entries(selectedApproval.content).map(([key, value]: [string, any]) => {
                  if (key === 'attachment') return null;
                  const labels: Record<string, string> = {
                    type: '请假类型',
                    startDate: '开始时间',
                    endDate: '结束时间',
                    reason: '请假事由',
                    days: '请假天数'
                  };
                  return (
                    <div key={key} className="flex justify-between items-start">
                      <span className="text-xs text-slate-400 font-bold uppercase">{labels[key] || key}</span>
                      <span className="text-sm font-bold text-slate-900 text-right max-w-[200px]">{value}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Decision Assist Area (Only for manager) */}
            {activeTab === 'pending' && selectedApproval.status === 'pending' && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Sparkles size={18} className="text-brand-500" />
                  决策辅助
                </h4>
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-3">申请人历史记录</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-slate-50 p-3 rounded-xl text-center">
                        <p className="text-lg font-bold text-slate-900">2天</p>
                        <p className="text-[10px] text-slate-400">本月已请</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl text-center">
                        <p className="text-lg font-bold text-slate-900">10天</p>
                        <p className="text-[10px] text-slate-400">本年已请</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl text-center">
                        <p className="text-lg font-bold text-emerald-600">0次</p>
                        <p className="text-[10px] text-slate-400">历史爽约</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-3">假期余额</p>
                    <div className="flex items-center justify-between bg-brand-50/50 p-4 rounded-2xl border border-brand-100">
                      <div>
                        <p className="text-sm font-bold text-slate-900">年假余额: 10 天</p>
                        <p className="text-xs text-brand-600 mt-1">本次请假后剩余: 7 天</p>
                      </div>
                      <div className="w-10 h-10 rounded-full border-4 border-brand-200 border-t-brand-600 flex items-center justify-center text-[10px] font-bold text-brand-600">
                        70%
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-3">类似申请处理结果</p>
                    <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold">
                      <CheckCircle2 size={14} />
                      近期类似请假申请: 5 条, 全部通过
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h4 className="font-bold text-slate-900 mb-6">审批流程</h4>
              <div className="space-y-8 relative">
                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100" />
                
                {/* Node 1 */}
                <div className="flex gap-4 relative">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center z-10 shadow-lg shadow-emerald-100">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">发起人 ({selectedApproval.initiator})</p>
                    <p className="text-[10px] text-emerald-600 font-bold mt-0.5">✓ 已提交</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{selectedApproval.time}</p>
                  </div>
                </div>

                {/* Node 2 */}
                <div className="flex gap-4 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                    isTimeout ? 'bg-red-50 text-red-500 border-2 border-red-200' : 'bg-white border-2 border-amber-400 text-amber-500 shadow-lg shadow-amber-50'
                  }`}>
                    {isTimeout ? <AlertCircle size={16} /> : <Clock size={16} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-900">审批人 (李四, 直属上级)</p>
                      {!isTimeout && selectedApproval.initiator === MOCK_USER.name && (
                        <button 
                          onClick={() => setShowRemindConfirm(true)}
                          className="text-[10px] bg-brand-50 text-brand-600 px-2 py-1 rounded-lg font-bold active:scale-95 transition-transform"
                        >
                          催办
                        </button>
                      )}
                    </div>
                    {isTimeout ? (
                      <p className="text-[10px] text-red-500 font-bold mt-0.5">⚠️ 已超时, 已升级</p>
                    ) : (
                      <p className="text-[10px] text-amber-500 font-bold mt-0.5">⏳ 待审批 (已等待 2 小时)</p>
                    )}
                  </div>
                </div>

                {/* Node 3 */}
                <div className="flex gap-4 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                    isTimeout ? 'bg-white border-2 border-amber-400 text-amber-500 shadow-lg shadow-amber-50' : 'bg-white border-2 border-slate-200 text-slate-300'
                  }`}>
                    {isTimeout ? <Clock size={16} /> : <History size={16} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">审批人 (王五, 部门主管)</p>
                    {isTimeout ? (
                      <p className="text-[10px] text-amber-500 font-bold mt-0.5">⏳ 待审批</p>
                    ) : (
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">⏸️ 等待中 (等待节点 2 通过)</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Manager Operation Area */}
            {activeTab === 'pending' && selectedApproval.status === 'pending' && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-4">审批意见</h4>
                <textarea 
                  placeholder="请填写审批意见(可选)..."
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm min-h-[100px] outline-none focus:border-brand-200 transition-colors mb-6"
                />
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setShowRejectDialog(true)}
                    className="py-4 rounded-2xl font-bold text-red-500 bg-red-50 border border-red-100 active:scale-95 transition-transform"
                  >
                    拒绝
                  </button>
                  <button 
                    onClick={() => setShowApproveConfirm(true)}
                    className="py-4 rounded-2xl font-bold text-white bg-brand-600 shadow-lg shadow-brand-100 active:scale-95 transition-transform"
                  >
                    通过
                  </button>
                  <button className="py-4 rounded-2xl font-bold text-slate-600 bg-slate-50 border border-slate-100 active:scale-95 transition-transform">
                    转审
                  </button>
                  <button className="py-4 rounded-2xl font-bold text-slate-600 bg-slate-50 border border-slate-100 active:scale-95 transition-transform">
                    加签
                  </button>
                </div>
              </div>
            )}

            {/* Only initiator can revoke, and only in 'mine' tab */}
            {activeTab === 'mine' && selectedApproval.initiator === MOCK_USER.name && selectedApproval.status === 'pending' && (
              <div className="pt-4">
                <button 
                  onClick={() => setShowRevokeConfirm(true)}
                  className="w-full bg-white text-red-500 border border-red-100 py-4 rounded-2xl font-bold text-lg shadow-sm active:scale-95 transition-transform"
                >
                  撤销申请
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showApproveConfirm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowApproveConfirm(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm relative z-10 shadow-2xl"
            >
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">确认通过?</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">通过后, 审批将流转给下一审批人。确认执行此操作吗?</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowApproveConfirm(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-slate-400 bg-slate-50 active:scale-95 transition-transform"
                >
                  取消
                </button>
                <button 
                  onClick={handleApprove}
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-emerald-600 shadow-lg shadow-emerald-100 active:scale-95 transition-transform"
                >
                  确认通过
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showRejectDialog && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowRejectDialog(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm relative z-10 shadow-2xl"
            >
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4">
                <XCircle size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">请填写拒绝原因</h3>
              <textarea 
                placeholder="必填, 请输入拒绝理由..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm min-h-[80px] outline-none focus:border-red-200 transition-colors mb-6"
              />
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowRejectDialog(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-slate-400 bg-slate-50 active:scale-95 transition-transform"
                >
                  取消
                </button>
                <button 
                  onClick={handleReject}
                  disabled={!rejectReason}
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 shadow-lg shadow-red-100 active:scale-95 transition-transform disabled:opacity-50"
                >
                  确认拒绝
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showRemindConfirm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowRemindConfirm(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm relative z-10 shadow-2xl"
            >
              <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mb-4">
                <Bell size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">确认催办?</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">系统将推送提醒给审批人李四, 提醒其尽快处理您的申请。</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowRemindConfirm(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-slate-400 bg-slate-50 active:scale-95 transition-transform"
                >
                  取消
                </button>
                <button 
                  onClick={handleRemind}
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-brand-600 shadow-lg shadow-brand-100 active:scale-95 transition-transform"
                >
                  确认
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showRevokeConfirm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowRevokeConfirm(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm relative z-10 shadow-2xl"
            >
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">确认撤销申请?</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">撤销后该申请将失效, 您需要重新发起。确认执行此操作吗?</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowRevokeConfirm(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-slate-400 bg-slate-50 active:scale-95 transition-transform"
                >
                  取消
                </button>
                <button 
                  onClick={handleRevoke}
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 shadow-lg shadow-red-100 active:scale-95 transition-transform"
                >
                  确认撤销
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      {view === 'list' && renderList()}
      {view === 'leave_form' && renderLeaveForm()}
      {view === 'details' && renderDetails()}
    </>
  );
};

const DocumentDetailView = ({ doc, onBack }: { doc: DocType; onBack: () => void }) => {
  // Simple TOC extraction from markdown
  const toc = doc.content.match(/^##\s+(.+)$/gm)?.map(h => h.replace(/^##\s+/, '')) || [];

  const scrollToSection = (title: string) => {
    const elements = document.getElementsByTagName('h2');
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].textContent === title) {
        elements[i].scrollIntoView({ behavior: 'smooth' });
        break;
      }
    }
  };

  const recommendedDocs = MOCK_DOCS.filter(d => 
    ['出差申请模板', '差旅报销流程', '差旅费用标准'].includes(d.title) && d.id !== doc.id
  );

  return (
    <div className="min-h-screen bg-white animate-in slide-in-from-right duration-300 max-w-md mx-auto relative shadow-2xl">
      <Header title={doc.title || "文档详情"} showBack onBack={onBack} />
      
      <div className="px-6 py-8 pb-12">
        {/* Meta Info */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">{doc.title}</h1>
          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-bold">发布人: {doc.publisher}</span>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-bold">时间: {doc.time}</span>
            {doc.version && (
              <span className="text-[10px] bg-brand-50 text-brand-600 px-2 py-1 rounded-full font-bold">
                版本: {doc.version}{doc.isLatest && '(最新版)'}
              </span>
            )}
            {doc.tags.map(tag => (
              <span key={tag} className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full font-bold">#{tag}</span>
            ))}
          </div>
        </div>

        {/* TOC */}
        {toc.length > 0 && (
          <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">目录导航</h4>
            <div className="space-y-2">
              {toc.map((item, idx) => (
                <button 
                  key={idx}
                  onClick={() => scrollToSection(item)}
                  className="block text-sm text-brand-600 hover:underline text-left w-full"
                >
                  {idx + 1}. {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="markdown-body prose prose-slate max-w-none text-slate-900 text-sm leading-relaxed mb-12">
          <Markdown>{doc.content}</Markdown>
        </div>

        {/* Related Docs */}
        <div className="mt-12 pt-8 border-t border-slate-100">
          <h4 className="text-sm font-bold text-slate-900 mb-4">相关文档推荐</h4>
          <div className="space-y-3">
            {recommendedDocs.map(d => (
              <div key={d.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-brand-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 shadow-sm">
                    <FileText size={16} />
                  </div>
                  <span className="text-xs font-medium text-slate-700">{d.title}</span>
                </div>
                <ChevronRight size={14} className="text-slate-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const DocumentAdminModule = ({ onBack }: { onBack: () => void }) => {
  const stats = [
    { label: '文档总数', value: '500', unit: '个', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: '本月查看', value: '10000', unit: '次', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: '本月新增', value: '20', unit: '个', icon: Plus, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: '本月更新', value: '50', unit: '个', icon: History, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const popularDocs = [
    { name: '差旅政策 V2.0', views: 1250, downloads: 450 },
    { name: '员工手册 2026', views: 980, downloads: 320 },
    { name: '项目管理规范', views: 850, downloads: 210 },
    { name: '财务报销流程', views: 720, downloads: 180 },
  ];

  const unpopularDocs = [
    { name: '旧版考勤制度', views: 0, time: '2024-12-20' },
    { name: '2024团建方案', views: 2, time: '2024-11-05' },
    { name: '废弃项目文档 A', views: 0, time: '2025-01-10' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-24 animate-in fade-in duration-500">
      <Header title="文档使用统计" showBack onBack={onBack} />
      
      <div className="px-4 py-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className={`w-8 h-8 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                <stat.icon size={18} />
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-bold text-slate-900">{stat.value}</span>
                <span className="text-[10px] text-slate-400 font-medium">{stat.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Popular Documents */}
        <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-500" />
              热门文档排行榜
            </h3>
            <BarChart3 size={18} className="text-slate-300" />
          </div>
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">文档名称</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase text-center">查看</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase text-center">下载</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {popularDocs.map((doc, idx) => (
                  <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-slate-700 truncate max-w-[120px]">{doc.name}</td>
                    <td className="px-4 py-4 text-xs text-slate-500 text-center">{doc.views}</td>
                    <td className="px-4 py-4 text-xs text-slate-500 text-center">{doc.downloads}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-md hover:bg-brand-100 transition-colors">
                        详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Unpopular Documents */}
        <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <TrendingDown size={18} className="text-red-500" />
              冷门文档列表
            </h3>
            <AlertCircle size={18} className="text-slate-300" />
          </div>
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">文档名称</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase text-center">查看</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase text-center">发布时间</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {unpopularDocs.map((doc, idx) => (
                  <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-slate-700 truncate max-w-[120px]">{doc.name}</td>
                    <td className="px-4 py-4 text-xs text-red-500 text-center font-medium">{doc.views}</td>
                    <td className="px-4 py-4 text-xs text-slate-500 text-center">{doc.time}</td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors" title="归档">
                        <Archive size={14} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="删除">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

const DocumentModule = ({ onManage, onBack }: { onManage?: () => void; onBack?: () => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');
  const [selectedDoc, setSelectedDoc] = useState<DocType | null>(null);

  const categories = ['全部', '制度类', '业务类', '收藏夹', '最近查看'];

  const filteredDocs = MOCK_DOCS.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         doc.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === '全部' || 
                           (activeCategory === '制度类' && doc.category === 'policy') ||
                           (activeCategory === '业务类' && doc.category === 'process');
    return matchesSearch && matchesCategory;
  });

  const renderList = () => (
    <div className="px-4 py-6 pb-24">
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text"
          placeholder="搜索制度规定、业务资料..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-100 border-none rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-brand-500 transition-all"
        />
      </div>

      <div className="flex gap-3 overflow-x-auto hide-scrollbar mb-8">
        {categories.map((cat) => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-colors ${
              activeCategory === cat ? 'bg-brand-600 text-white shadow-md shadow-brand-100' : 'bg-white text-slate-500 border border-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {searchQuery && (
        <h3 className="text-sm font-bold text-slate-900 mb-4">搜索结果: {searchQuery}</h3>
      )}

      <div className="space-y-4">
        {filteredDocs.length > 0 ? (
          filteredDocs.map((doc) => (
            <motion.div 
              key={doc.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedDoc(doc)}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-start gap-4 cursor-pointer hover:border-brand-100 transition-colors"
            >
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                <FileText size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-slate-900 text-sm truncate">{doc.title}</h4>
                  {doc.isLatest && (
                    <span className="text-[8px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-bold shrink-0">最新版</span>
                  )}
                  {doc.status === 'expired' && (
                    <span className="text-[8px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-bold shrink-0">已失效</span>
                  )}
                </div>
                {doc.summary && (
                  <p className="text-[10px] text-slate-400 line-clamp-2 mb-2 leading-relaxed">{doc.summary}</p>
                )}
                <div className="flex items-center gap-3 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1"><User size={10} /> {doc.publisher}</span>
                  <span className="flex items-center gap-1"><Clock size={10} /> {doc.time}</span>
                </div>
              </div>
              <button className="bg-brand-50 text-brand-600 px-3 py-1.5 rounded-lg text-[10px] font-bold self-center">查看</button>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Search size={32} />
            </div>
            <p className="text-sm text-slate-400">未找到您想要的文档? 可以尝试其他关键词</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="pb-24 animate-in fade-in duration-500">
      {selectedDoc ? (
        <DocumentDetailView doc={selectedDoc} onBack={() => setSelectedDoc(null)} />
      ) : (
        <>
          <Header title="文档查询" showBack={!!onBack} onBack={onBack} />
          {renderList()}
        </>
      )}
    </div>
  );
};

const TravelModule = ({ 
  setApprovals, 
  setNotification,
  setActiveTab,
  itineraries,
  setItineraries
}: { 
  setApprovals: React.Dispatch<React.SetStateAction<Approval[]>>,
  setNotification: React.Dispatch<React.SetStateAction<{ 
    title: string; 
    body: string; 
    actionLabel?: string; 
    onAction?: () => void 
  } | null>>,
  setActiveTab: (tab: TabType) => void,
  itineraries: Itinerary[],
  setItineraries: React.Dispatch<React.SetStateAction<Itinerary[]>>
}) => {
  const [view, setView] = useState<'form' | 'recommendation' | 'booking'>('form');
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [form, setForm] = useState({
    destination: '',
    startDate: '2026-04-15',
    endDate: '2026-04-17',
    reason: '',
    companion: ''
  });

  const [selectedTransport, setSelectedTransport] = useState<'train' | 'flight'>('train');
  const [selectedHotel, setSelectedHotel] = useState(0);
  const [previewDoc, setPreviewDoc] = useState<DocType | null>(null);
  const [fullDoc, setFullDoc] = useState<DocType | null>(null);

  const relatedDocs = MOCK_DOCS.filter(doc => 
    ['d1', 'd2', 'd4'].includes(doc.id)
  ).sort((a, b) => {
    const order = { 'd1': 1, 'd2': 2, 'd4': 3 };
    return (order[a.id as keyof typeof order] || 99) - (order[b.id as keyof typeof order] || 99);
  });

  // Auto-switch to booking view if there's an approved trip but no itinerary
  useEffect(() => {
    if (itineraries.length === 0 && view === 'form') {
      // In a real app, we'd check approvals here. 
      // For demo, we'll let the notification action trigger it or manual entry.
    }
  }, [itineraries, view]);

  const calculateDays = () => {
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    return Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleViewRecommendation = () => {
    if (!form.destination || !form.reason) {
      setNotification({ title: '信息不完整', body: '请填写出差地点和事由' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setView('recommendation');
    }, 1500);
  };

  const handleSubmit = () => {
    const days = calculateDays();
    const totalCost = (selectedTransport === 'train' ? 553 : 800) + (300 * days) + (100 * days);
    
    const newApproval: Approval = {
      id: `t-${Date.now()}`,
      type: 'trip',
      title: `出差申请 - ${form.destination}`,
      initiator: MOCK_USER.name,
      time: new Date().toLocaleString('zh-CN', { hour12: false }),
      status: 'pending',
      content: {
        地点: form.destination,
        时间: `${form.startDate} 至 ${form.endDate} (共 ${days} 天)`,
        事由: form.reason,
        交通: selectedTransport === 'train' ? '高铁 G1234' : '航班 CA1234',
        住宿: 'XX 酒店',
        预估成本: `¥${totalCost}`
      }
    };

    setApprovals(prev => [newApproval, ...prev]);
    setNotification({
      title: '提交成功',
      body: '出差申请已提交, 等待审批'
    });
    setActiveTab('approval');
  };

  const handleCompleteBooking = () => {
    setLoading(true);
    setTimeout(() => {
      const newItinerary: Itinerary = {
        id: `i-${Date.now()}`,
        destination: form.destination || '北京',
        time: `${form.startDate} 至 ${form.endDate}`,
        transport: selectedTransport === 'train' ? '高铁 G1234, 08:00 - 12:00' : '航班 CA1234, 10:00 - 12:00',
        hotel: 'XX 酒店, 3 晚',
        status: 'booked'
      };
      setItineraries([newItinerary]);
      setLoading(false);
      setView('form');
      setNotification({
        title: '订票成功',
        body: '订票成功, 出发前 1 天将提醒您'
      });
    }, 2000);
  };

  const renderForm = () => (
    <div className="px-6 py-8 pb-32 space-y-8 animate-in fade-in duration-500">
      {/* Itinerary Card if exists */}
      {itineraries.length > 0 && (
        <section className="animate-in zoom-in-95 duration-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Plane size={16} className="text-brand-500" />
              我的行程
            </h3>
            <span className="text-[10px] text-brand-600 font-bold bg-brand-50 px-2 py-0.5 rounded-full">即将出发</span>
          </div>
          {itineraries.map(item => (
            <div key={item.id} className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-brand-500/20 transition-colors" />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-2xl font-bold">{item.destination}</h4>
                    <p className="text-white/50 text-xs mt-1">{item.time}</p>
                  </div>
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <QrCode size={20} />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                      <Plane size={14} />
                    </div>
                    <span className="text-white/80">{item.transport}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                      <Hotel size={14} />
                    </div>
                    <span className="text-white/80">{item.hotel}</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-brand-400 font-bold">
                    <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
                    已同步至日历
                  </div>
                  <button className="text-[10px] font-bold bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20 transition-colors">
                    查看详情
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <MapPin size={16} className="text-brand-500" />
            第一步: 出差地点
          </h3>
          {itineraries.length === 0 && (
            <button 
              onClick={() => setView('booking')}
              className="text-[10px] text-brand-600 font-bold flex items-center gap-1"
            >
              <History size={12} />
              直接订票
            </button>
          )}
        </div>
        <div className="relative">
          <input 
            type="text"
            placeholder="搜索城市..."
            value={form.destination}
            onChange={(e) => setForm(prev => ({ ...prev, destination: e.target.value }))}
            className="w-full bg-white border border-slate-100 rounded-2xl p-4 pl-12 text-sm outline-none focus:border-brand-200 shadow-sm"
          />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
        </div>
        <div className="flex gap-2 mt-3">
          {['北京', '上海', '深圳'].map(city => (
            <button 
              key={city}
              onClick={() => setForm(prev => ({ ...prev, destination: city }))}
              className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full font-bold hover:bg-slate-200 transition-colors"
            >
              {city}
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calendar size={16} className="text-brand-500" />
            第二步: 出差时间
          </h3>
          <span className="text-[10px] text-slate-400 font-medium">共 {calculateDays()} 天</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase">出发日期</p>
            <input 
              type="date" 
              value={form.startDate}
              onChange={(e) => setForm(prev => ({ ...prev, startDate: e.target.value }))}
              className="bg-transparent text-sm font-bold text-slate-900 outline-none w-full"
            />
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase">返回日期</p>
            <input 
              type="date" 
              value={form.endDate}
              onChange={(e) => setForm(prev => ({ ...prev, endDate: e.target.value }))}
              className="bg-transparent text-sm font-bold text-slate-900 outline-none w-full"
            />
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <FileText size={16} className="text-brand-500" />
          第三步: 出差事由
        </h3>
        <div className="relative">
          <textarea 
            placeholder="请输入出差事由..."
            value={form.reason}
            onChange={(e) => setForm(prev => ({ ...prev, reason: e.target.value }))}
            className="w-full bg-white border border-slate-100 rounded-2xl p-4 text-sm min-h-[100px] outline-none focus:border-brand-200 shadow-sm"
          />
          <div className="absolute bottom-4 right-4 text-slate-300">
            <Wifi size={18} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {['客户拜访', '项目会议', '培训学习'].map(s => (
            <button 
              key={s}
              onClick={() => setForm(prev => ({ ...prev, reason: s }))}
              className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full font-bold hover:bg-slate-200 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Users size={16} className="text-brand-500" />
          第四步: 同行人员 (可选)
        </h3>
        <div className="relative">
          <input 
            type="text"
            placeholder="输入姓名或从通讯录选择..."
            value={form.companion}
            onChange={(e) => setForm(prev => ({ ...prev, companion: e.target.value }))}
            className="w-full bg-white border border-slate-100 rounded-2xl p-4 pl-12 text-sm outline-none focus:border-brand-200 shadow-sm"
          />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
        </div>
      </section>

      <div className="pt-4 space-y-8">
        {/* Related Documents */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FileText size={16} className="text-brand-500" />
            相关文档
          </h3>
          <div className="space-y-3">
            {relatedDocs.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400">
                    <FileText size={16} />
                  </div>
                  <span className="text-xs font-medium text-slate-700">{doc.title}</span>
                </div>
                <button 
                  onClick={() => setPreviewDoc(doc)}
                  className="text-[10px] text-brand-600 font-bold px-3 py-1.5 bg-white rounded-lg shadow-sm active:scale-95 transition-transform"
                >
                  查看
                </button>
              </div>
            ))}
          </div>
        </section>

        <button 
          onClick={handleViewRecommendation}
          disabled={loading}
          className="w-full bg-brand-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-brand-100 active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              推荐中...
            </>
          ) : '查看方案'}
        </button>
      </div>

      {/* Document Preview Overlay */}
      <AnimatePresence>
        {previewDoc && (
          <div className="fixed inset-0 max-w-md mx-auto z-[120] flex items-end justify-center">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setPreviewDoc(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white rounded-t-[40px] p-8 w-full max-w-md relative z-10 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
              <h3 className="text-xl font-bold text-slate-900 mb-4">{previewDoc.title}</h3>
              
              <div className="bg-slate-50 rounded-2xl p-4 mb-6">
                <p className="text-sm text-slate-600 leading-relaxed">
                  {previewDoc.summary || previewDoc.content.substring(0, 150) + '...'}
                </p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setPreviewDoc(null)}
                  className="flex-1 py-4 rounded-2xl font-bold text-slate-400 bg-slate-50 active:scale-95 transition-transform"
                >
                  关闭
                </button>
                <button 
                  onClick={() => {
                    setFullDoc(previewDoc);
                    setPreviewDoc(null);
                  }}
                  className="flex-1 py-4 rounded-2xl font-bold text-white bg-brand-600 shadow-lg shadow-brand-100 active:scale-95 transition-transform"
                >
                  查看全文
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full Document View */}
      <AnimatePresence>
        {fullDoc && (
          <div className="fixed inset-0 max-w-md mx-auto z-[130] bg-white overflow-y-auto">
            <DocumentDetailView doc={fullDoc} onBack={() => setFullDoc(null)} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderRecommendation = () => (
    <div className="px-4 py-6 pb-32 space-y-6 animate-in slide-in-from-bottom duration-500">
      {/* Transport */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-bold text-slate-900">交通方案</h4>
          <div className="flex bg-slate-50 p-1 rounded-xl">
            <button 
              onClick={() => setSelectedTransport('train')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedTransport === 'train' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-400'}`}
            >
              高铁
            </button>
            <button 
              onClick={() => setSelectedTransport('flight')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedTransport === 'flight' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-400'}`}
            >
              飞机
            </button>
          </div>
        </div>

        <div className="p-4 rounded-2xl border-2 border-brand-50 bg-brand-50/10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-lg font-bold text-slate-900">{selectedTransport === 'train' ? 'G1234' : 'CA1234'}</p>
              <p className="text-xs text-slate-400 mt-1">2026-04-15 08:00 - 12:00 (4小时)</p>
            </div>
            <p className="text-xl font-bold text-brand-600">¥{selectedTransport === 'train' ? '553' : '800'}</p>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg w-fit">
            <CheckCircle2 size={12} />
            {selectedTransport === 'train' ? '二等座符合经理级差旅标准' : '经济舱符合经理级差旅标准'}
          </div>
        </div>
      </section>

      {/* Accommodation */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <h4 className="font-bold text-slate-900 mb-6">住宿方案</h4>
        <div className="space-y-4">
          {[
            { name: 'XX 酒店', dist: '500米', price: 300 },
            { name: 'YY 商务酒店', dist: '1.2公里', price: 280 },
          ].map((hotel, idx) => (
            <div 
              key={idx}
              onClick={() => setSelectedHotel(idx)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${selectedHotel === idx ? 'border-brand-600 bg-brand-50/10' : 'border-slate-50 bg-slate-50/50'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-bold text-slate-900">{hotel.name}</p>
                  <p className="text-[10px] text-slate-400 mt-1">距离目的地: {hotel.dist}</p>
                </div>
                <p className="text-sm font-bold text-brand-600">¥{hotel.price}/晚</p>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-emerald-600 font-bold">
                <CheckCircle2 size={12} />
                符合经理级差旅标准
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cost Summary */}
      <section className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
        <h4 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">预估总成本</h4>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">交通 ({selectedTransport === 'train' ? '高铁' : '飞机'})</span>
            <span className="font-mono">¥{selectedTransport === 'train' ? '553' : '800'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">住宿 (3晚)</span>
            <span className="font-mono">¥900</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">补贴 (3天)</span>
            <span className="font-mono">¥300</span>
          </div>
          <div className="pt-3 border-t border-white/10 flex justify-between items-end">
            <span className="font-bold">合计</span>
            <span className="text-2xl font-mono font-bold text-brand-400">
              ¥{(selectedTransport === 'train' ? 553 : 800) + 900 + 300}
            </span>
          </div>
        </div>
      </section>

      <div className="pt-4">
        <button 
          onClick={() => setShowConfirm(true)}
          className="w-full bg-brand-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-brand-100 active:scale-95 transition-transform"
        >
          选择方案并提交审批
        </button>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm relative z-10 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-4">确认提交出差申请?</h3>
              <div className="space-y-3 mb-8">
                {[
                  { label: '出差地点', value: form.destination },
                  { label: '出差时间', value: `${form.startDate} 至 ${form.endDate}` },
                  { label: '交通方案', value: selectedTransport === 'train' ? '高铁 G1234' : '航班 CA1234' },
                  { label: '住宿方案', value: 'XX 酒店' },
                  { label: '预估成本', value: `¥${(selectedTransport === 'train' ? 553 : 800) + 1200}` },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-slate-400 font-bold uppercase">{item.label}</span>
                    <span className="text-slate-900 font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-slate-400 bg-slate-50 active:scale-95 transition-transform"
                >
                  取消
                </button>
                <button 
                  onClick={handleSubmit}
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-brand-600 shadow-lg shadow-brand-100 active:scale-95 transition-transform"
                >
                  确认提交
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderBooking = () => (
    <div className="min-h-screen bg-white animate-in slide-in-from-right duration-500">
      <div className="p-6 flex items-center justify-between border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white">
            <Plane size={18} />
          </div>
          <span className="font-bold text-slate-900">携程企业版</span>
        </div>
        <span className="text-[10px] text-slate-400 font-medium">合作伙伴提供服务</span>
      </div>

      <div className="px-6 py-8">
        <div className="bg-slate-50 rounded-3xl p-6 mb-8">
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">已自动填充出差信息</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-[10px] text-slate-400 font-bold mb-1">出发地</p>
                <p className="text-lg font-bold text-slate-900">上海</p>
              </div>
              <ArrowRight className="text-slate-300" size={20} />
              <div className="flex-1">
                <p className="text-[10px] text-slate-400 font-bold mb-1">目的地</p>
                <p className="text-lg font-bold text-slate-900">{form.destination || '北京'}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold mb-1">出差时间</p>
              <p className="text-sm font-bold text-slate-900">{form.startDate} 至 {form.endDate}</p>
            </div>
          </div>
        </div>

        <h4 className="font-bold text-slate-900 mb-4">推荐交通方案</h4>
        <div className="p-5 rounded-2xl border-2 border-brand-600 bg-brand-50/10 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-lg font-bold text-slate-900">{selectedTransport === 'train' ? '高铁 G1234' : '航班 CA1234'}</p>
              <p className="text-xs text-slate-400 mt-1">08:00 - 12:00 (4小时)</p>
            </div>
            <p className="text-xl font-bold text-brand-600">¥{selectedTransport === 'train' ? '553' : '800'}</p>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-emerald-600 font-bold">
            <CheckCircle2 size={12} />
            已通过审批, 可直接订票
          </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleCompleteBooking}
            disabled={loading}
            className="w-full bg-brand-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-brand-100 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                订票中...
              </>
            ) : '确认并订票'}
          </button>
          <button 
            onClick={() => setView('form')}
            className="w-full bg-white text-slate-400 py-4 rounded-2xl font-bold text-sm active:scale-95 transition-transform"
          >
            返回修改
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {view !== 'booking' && (
        <Header 
          title={view === 'form' ? "出差申请" : "为您推荐差旅方案"} 
          showBack 
          onBack={() => view === 'recommendation' ? setView('form') : setActiveTab('home')} 
        />
      )}
      {view === 'form' ? renderForm() : view === 'recommendation' ? renderRecommendation() : renderBooking()}
    </div>
  );
};

const ReimbursementModule = ({ 
  setApprovals, 
  setNotification,
  setActiveTab
}: { 
  setApprovals: React.Dispatch<React.SetStateAction<Approval[]>>,
  setNotification: React.Dispatch<React.SetStateAction<{ 
    title: string; 
    body: string; 
    actionLabel?: string; 
    onAction?: () => void 
  } | null>>,
  setActiveTab: (tab: TabType) => void
}) => {
  const [loading, setLoading] = useState(false);
  const [extraExpenses, setExtraExpenses] = useState({ food: 300, other: 100 });

  const transportCost = 553;
  const hotelCost = 900;
  const allowance = 300;
  const totalAmount = transportCost + hotelCost + extraExpenses.food + extraExpenses.other + allowance;

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      const newApproval: Approval = {
        id: `r-${Date.now()}`,
        type: 'leave', // Using leave as proxy for general approval style, or could add 'reimbursement'
        title: '出差报销申请 - 北京',
        initiator: MOCK_USER.name,
        time: new Date().toLocaleString('zh-CN', { hour12: false }),
        status: 'pending',
        content: {
          出差地点: '北京',
          出差时间: '2026-04-15 至 2026-04-17',
          报销总额: `¥${totalAmount}`,
          费用明细: `交通 ¥${transportCost}, 住宿 ¥${hotelCost}, 餐饮 ¥${extraExpenses.food}, 其他 ¥${extraExpenses.other}, 补贴 ¥${allowance}`
        }
      };
      setApprovals(prev => [newApproval, ...prev]);
      setLoading(false);
      setNotification({
        title: '报销单已提交',
        body: '报销单已提交, 等待审批'
      });
      setActiveTab('approval');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 animate-in slide-in-from-bottom duration-500">
      <Header title="出差报销单" showBack onBack={() => setActiveTab('home')} />
      
      <div className="px-6 py-8 pb-32 space-y-6">
        {/* Trip Info */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">出差信息</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">出差地点</span>
              <span className="text-sm font-bold text-slate-900">北京</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">出差时间</span>
              <span className="text-sm font-bold text-slate-900">04-15 至 04-17 (3天)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">出差事由</span>
              <span className="text-sm font-bold text-slate-900">客户拜访</span>
            </div>
          </div>
        </section>

        {/* Expenses */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">费用明细</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                  <Plane size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">交通费 (高铁票)</p>
                  <p className="text-[10px] text-slate-400">已自动关联</p>
                </div>
              </div>
              <span className="text-sm font-mono font-bold text-slate-900">¥{transportCost}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
                  <Hotel size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">住宿费 (XX 酒店)</p>
                  <p className="text-[10px] text-slate-400">已自动关联</p>
                </div>
              </div>
              <span className="text-sm font-mono font-bold text-slate-900">¥{hotelCost}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                  <Receipt size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">餐饮费</p>
                  <p className="text-[10px] text-slate-400">手动上传发票</p>
                </div>
              </div>
              <span className="text-sm font-mono font-bold text-slate-900">¥{extraExpenses.food}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center">
                  <Plus size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">其他费用</p>
                  <p className="text-[10px] text-slate-400">手动上传发票</p>
                </div>
              </div>
              <span className="text-sm font-mono font-bold text-slate-900">¥{extraExpenses.other}</span>
            </div>
          </div>
        </section>

        {/* Allowance */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">出差补贴</h4>
              <p className="text-[10px] text-slate-400">100 元/天 × 3 天</p>
            </div>
            <span className="text-sm font-mono font-bold text-slate-900">¥{allowance}</span>
          </div>
        </section>

        {/* Total */}
        <section className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
          <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2">报销总额</p>
          <div className="flex items-baseline gap-1">
            <span className="text-brand-400 text-xl font-bold">¥</span>
            <span className="text-4xl font-mono font-bold">{totalAmount}</span>
          </div>
        </section>

        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-brand-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-brand-100 active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              提交中...
            </>
          ) : '提交审批'}
        </button>
      </div>
    </div>
  );
};

const TeamAttendanceModule = ({ onBack }: { onBack: () => void }) => {
  const [view, setView] = useState<'board' | 'detail'>('board');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('全部');
  const [sortBy, setSortBy] = useState('time-asc');

  const stats = [
    { label: '今日在岗', value: '50', percent: '83%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: '今日请假', value: '5', percent: '8%', color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: '今日出差', value: '3', percent: '5%', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: '今日异常', value: '2', percent: '3%', color: 'text-red-600', bg: 'bg-red-50' },
  ];

  const members = [
    { id: 1, name: '张三', dept: '产品部', post: '产品经理', status: '在岗', time: '08:30' },
    { id: 2, name: '李四', dept: '技术部', post: '后端开发', status: '请假', time: '-' },
    { id: 3, name: '王五', dept: '设计部', post: 'UI设计师', status: '出差', time: '09:00' },
    { id: 4, name: '赵六', dept: '市场部', post: '市场专员', status: '异常', time: '09:45' },
    { id: 5, name: '钱七', dept: '产品部', post: '产品助理', status: '在岗', time: '08:45' },
  ];

  const filteredMembers = members.filter(m => filterStatus === '全部' || m.status === filterStatus);

  const renderBoard = () => (
    <div className="animate-in fade-in duration-500">
      <Header title="团队出勤看板" showBack onBack={onBack} />
      <div className="px-4 py-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">{stat.label}</p>
              <div className="flex items-baseline justify-between">
                <span className={`text-xl font-bold ${stat.color}`}>{stat.value}<span className="text-xs ml-0.5">人</span></span>
                <span className="text-[10px] text-slate-400 font-medium">{stat.percent}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {['全部', '在岗', '请假', '出差', '异常'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                filterStatus === status ? 'bg-brand-600 text-white shadow-lg shadow-brand-100' : 'bg-white text-slate-500 border border-slate-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Member List */}
        <section className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">员工姓名</th>
                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase text-center">状态</th>
                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase text-center">打卡时间</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">{member.name}</span>
                      <span className="text-[10px] text-slate-400">{member.dept}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${
                      member.status === '在岗' ? 'bg-emerald-50 text-emerald-600' :
                      member.status === '请假' ? 'bg-orange-50 text-orange-600' :
                      member.status === '出差' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center text-xs font-mono text-slate-500">{member.time}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => { setSelectedMember(member); setView('detail'); }}
                      className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-md hover:bg-brand-100 transition-colors"
                    >
                      详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );

  const renderDetail = () => (
    <div className="animate-in slide-in-from-right duration-300 bg-slate-50 min-h-screen">
      <Header title={`${selectedMember?.name} 出勤详情`} showBack onBack={() => setView('board')} />
      <div className="px-4 py-6 space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center text-2xl font-bold">
            {selectedMember?.name[0]}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">{selectedMember?.name}</h3>
            <p className="text-sm text-slate-500 mt-1">{selectedMember?.dept} · {selectedMember?.post}</p>
          </div>
        </div>

        {/* Monthly Stats */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">本月出勤情况</h4>
          <div className="grid grid-cols-3 gap-y-6 gap-x-4">
            {[
              { label: '在岗天数', value: '20', unit: '天' },
              { label: '请假天数', value: '2', unit: '天' },
              { label: '出差天数', value: '3', unit: '天' },
              { label: '迟到次数', value: '1', unit: '次', color: 'text-orange-500' },
              { label: '早退次数', value: '0', unit: '次' },
              { label: '漏打卡次数', value: '1', unit: '次', color: 'text-red-500' },
            ].map((item, idx) => (
              <div key={idx}>
                <p className="text-[10px] text-slate-400 mb-1">{item.label}</p>
                <p className={`text-lg font-bold ${item.color || 'text-slate-900'}`}>
                  {item.value}<span className="text-[10px] ml-0.5 font-medium text-slate-400">{item.unit}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Records */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">打卡记录 (2026-04)</h4>
          <div className="space-y-4">
            {[
              { date: '2026-04-01', status: '正常', time: '08:30 - 18:00', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
              { date: '2026-04-02', status: '迟到', time: '09:10 - 18:00', icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50' },
              { date: '2026-04-03', status: '漏打卡(已补卡)', time: '09:00 - 18:00', icon: History, color: 'text-blue-500', bg: 'bg-blue-50' },
            ].map((record, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${record.bg} ${record.color} rounded-lg flex items-center justify-center`}>
                    <record.icon size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{record.date}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{record.time}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold ${record.color}`}>{record.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return view === 'board' ? renderBoard() : renderDetail();
};

const AttendanceModule = ({ 
  isTripDay,
  setNotification,
  attendanceRecord,
  setAttendanceRecord,
  forgotClockIn,
  setApprovals,
  onTeamManage,
  onBack
}: { 
  isTripDay: boolean,
  setNotification: React.Dispatch<React.SetStateAction<{ title: string; body: string; actionLabel?: string; onAction?: () => void } | null>>,
  attendanceRecord: { type: 'in' | 'out'; time: string } | null,
  setAttendanceRecord: (record: { type: 'in' | 'out'; time: string } | null) => void,
  forgotClockIn: boolean,
  setApprovals: React.Dispatch<React.SetStateAction<Approval[]>>,
  onTeamManage?: () => void,
  onBack?: () => void
}) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  const [showFieldCheckIn, setShowFieldCheckIn] = useState(false);
  const [showMakeupForm, setShowMakeupForm] = useState(forgotClockIn);
  const [loading, setLoading] = useState(false);
  const [remark, setRemark] = useState('');
  
  // Makeup form state
  const [makeupType, setMakeupType] = useState<'in' | 'out'>('in');
  const [makeupTime, setMakeupTime] = useState('09:00');
  const [makeupReason, setMakeupReason] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const now = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      setAttendanceRecord({ type: 'in', time: now });
      setNotification({
        title: '打卡成功, 祝您工作愉快',
        body: `上班打卡时间: ${now}\n打卡方式: Wi-Fi 打卡 (Office_5G)`
      });
    }, 1000);
  };

  const handleFieldCheckIn = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowFieldCheckIn(false);
      setNotification({
        title: '外勤打卡成功',
        body: `打卡时间: ${new Date().toLocaleTimeString()} \n地点: 北京市朝阳区 XX 路 XX 号`
      });
    }, 1500);
  };

  const handleMakeupSubmit = () => {
    if (!makeupReason) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const newApproval: Approval = {
        id: `ap-${Date.now()}`,
        type: 'leave', // Using leave as a generic type for now, or could add 'makeup'
        title: `补卡申请 - ${makeupType === 'in' ? '上班' : '下班'}`,
        initiator: MOCK_USER.name,
        time: new Date().toISOString().split('T')[0],
        status: 'pending',
        content: {
          date: '2026-04-11',
          type: makeupType === 'in' ? '上班' : '下班',
          time: makeupTime,
          reason: makeupReason
        }
      };
      setApprovals(prev => [newApproval, ...prev]);
      setShowMakeupForm(false);
      setNotification({
        title: '补卡申请已提交, 等待审批',
        body: '已推送给您的直属上级进行审批'
      });
    }, 1500);
  };

  if (showMakeupForm) {
    return (
      <div className="min-h-screen bg-slate-50 pb-24 animate-in slide-in-from-right duration-300">
        <Header title="补卡申请" showBack onBack={() => setShowMakeupForm(false)} />
        <div className="px-6 py-8 space-y-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="space-y-6">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">补卡日期</p>
                <p className="text-lg font-bold text-slate-900">2026-04-11</p>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-3">补卡类型</p>
                <div className="flex bg-slate-50 p-1 rounded-xl">
                  <button 
                    onClick={() => setMakeupType('in')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${makeupType === 'in' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-400'}`}
                  >
                    上班
                  </button>
                  <button 
                    onClick={() => setMakeupType('out')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${makeupType === 'out' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-400'}`}
                  >
                    下班
                  </button>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-3">补卡时间</p>
                <input 
                  type="time" 
                  value={makeupTime}
                  onChange={(e) => setMakeupTime(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-lg font-mono font-bold text-slate-900 outline-none focus:ring-2 ring-brand-100 transition-all"
                />
              </div>

              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-3">补卡原因 (必填)</p>
                <textarea 
                  placeholder="请说明补卡原因..."
                  value={makeupReason}
                  onChange={(e) => setMakeupReason(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm min-h-[120px] outline-none focus:ring-2 ring-brand-100 transition-all"
                />
              </div>
            </div>
          </div>

          <button 
            onClick={handleMakeupSubmit}
            disabled={loading || !makeupReason}
            className="w-full bg-brand-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-brand-100 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                提交中...
              </>
            ) : '提交审批'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 animate-in slide-in-from-right duration-300">
      <Header title={isTripDay ? "外勤打卡" : "上班打卡"} showBack={!!onBack} onBack={onBack} />
      <div className="px-4 py-8">
        <div className="text-center mb-12">
          <div className="text-4xl font-mono font-bold text-slate-900 tracking-wider mb-2">{time}</div>
          <p className="text-slate-400 text-sm font-medium">2026年4月11日 星期六</p>
          {isTripDay && (
            <div className="mt-4 flex items-center justify-center gap-2 text-brand-600 bg-brand-50 px-4 py-2 rounded-full text-xs font-bold w-fit mx-auto">
              <Plane size={14} />
              出差中: 北京
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center mb-12">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (attendanceRecord) return;
              isTripDay ? setShowFieldCheckIn(true) : handleCheckIn();
            }}
            disabled={loading || !!attendanceRecord}
            className={`w-48 h-48 rounded-full shadow-2xl flex flex-col items-center justify-center text-white relative group transition-colors ${
              attendanceRecord ? 'bg-slate-300 shadow-none' :
              isTripDay ? 'bg-orange-500 shadow-orange-200' : 'bg-brand-600 shadow-brand-200'
            }`}
          >
            {!attendanceRecord && <div className="absolute inset-0 rounded-full border-4 border-white/20 scale-110 animate-ping duration-[3000ms]"></div>}
            {attendanceRecord ? <CheckCircle2 size={64} strokeWidth={1.5} /> :
             isTripDay ? <MapPin size={64} strokeWidth={1.5} /> : <Fingerprint size={64} strokeWidth={1.5} />}
            <span className="text-xl font-bold mt-4">{attendanceRecord ? '已打卡' : isTripDay ? '外勤打卡' : '上班打卡'}</span>
            <span className="text-xs text-white/70 mt-1">{attendanceRecord ? `打卡时间 ${attendanceRecord.time}` : isTripDay ? '当前在出差地点' : '08:30 - 18:00'}</span>
          </motion.button>
          
          <div className="mt-8 flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full text-xs font-bold">
            <Wifi size={14} />
            {isTripDay ? '已通过 GPS 定位校验' : '已连接公司 Wi-Fi: Office_5G'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setShowMakeupForm(true)}
            className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
              <History size={20} />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-900">补卡申请</div>
              <div className="text-[10px] text-slate-400">漏打卡补救</div>
            </div>
          </button>
          <button 
            onClick={onTeamManage}
            className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Users size={20} />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-900">团队出勤</div>
              <div className="text-[10px] text-slate-400">管理者看板</div>
            </div>
          </button>
        </div>
      </div>

      {/* Field Check-in Modal */}
      <AnimatePresence>
        {showFieldCheckIn && (
          <div className="fixed inset-0 z-[110] flex items-end justify-center">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowFieldCheckIn(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white rounded-t-[40px] p-8 w-full max-w-md relative z-10 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
              <h3 className="text-xl font-bold text-slate-900 mb-6">外勤打卡</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-600 shrink-0 shadow-sm">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">当前位置</p>
                    <p className="text-sm font-bold text-slate-900 leading-relaxed">北京市朝阳区 XX 路 XX 号</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900 mb-3">拍照证明在岗</p>
                  <div className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 group active:bg-slate-100 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm group-active:scale-95 transition-transform">
                      <Camera size={24} />
                    </div>
                    <p className="text-xs text-slate-400 font-medium">点击开启摄像头拍照</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900 mb-3">外勤原因 (可选)</p>
                  <textarea 
                    placeholder="请填写外勤原因..."
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm min-h-[100px] outline-none focus:ring-2 ring-brand-100 transition-all"
                  />
                </div>

                <button 
                  onClick={handleFieldCheckIn}
                  disabled={loading}
                  className="w-full bg-brand-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-brand-100 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      打卡中...
                    </>
                  ) : '打卡'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [userBookings, setUserBookings] = useState<MeetingRoom[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingRoom | null>(null);
  const [approvals, setApprovals] = useState<Approval[]>(MOCK_APPROVALS);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [isTripDay, setIsTripDay] = useState(false);
  const [isTripEnded, setIsTripEnded] = useState(false);
  const [isAtOffice, setIsAtOffice] = useState(false);
  const [forgotClockIn, setForgotClockIn] = useState(false);
  const [attendanceRecord, setAttendanceRecord] = useState<{ type: 'in' | 'out'; time: string } | null>(null);
  const [notification, setNotification] = useState<{ 
    title: string; 
    body: string; 
    actionLabel?: string; 
    onAction?: () => void 
  } | null>(null);

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="min-h-screen bg-slate-50 max-w-md mx-auto relative shadow-2xl overflow-y-auto hide-scrollbar">
      {/* Push Notification Simulation */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 16, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] z-[100] bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-slate-100 flex items-start gap-4"
          >
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shrink-0">
              <Calendar size={20} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-900">{notification.title}</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{notification.body}</p>
              {notification.actionLabel && (
                <button 
                  onClick={() => {
                    notification.onAction?.();
                    setNotification(null);
                  }}
                  className="mt-3 bg-brand-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-bold shadow-lg shadow-brand-100 active:scale-95 transition-transform"
                >
                  {notification.actionLabel}
                </button>
              )}
            </div>
            <button onClick={() => setNotification(null)} className="text-slate-300 hover:text-slate-500">
              <Plus className="rotate-45" size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="min-h-screen"
        >
          {activeTab === 'home' && (
            <HomeModule 
              setActiveTab={setActiveTab} 
              tasks={tasks} 
              isTripDay={isTripDay}
              setIsTripDay={setIsTripDay}
              isTripEnded={isTripEnded}
              setIsTripEnded={setIsTripEnded}
              isAtOffice={isAtOffice}
              setIsAtOffice={setIsAtOffice}
              forgotClockIn={forgotClockIn}
              setForgotClockIn={setForgotClockIn}
              attendanceRecord={attendanceRecord}
              setNotification={setNotification}
              onTaskClick={(task) => {
                if (task.type === 'meeting' && task.meetingRoomId) {
                  const meeting = userBookings.find(b => b.id === task.meetingRoomId);
                  if (meeting) {
                    setSelectedMeeting(meeting);
                    setActiveTab('meeting');
                  }
                }
              }}
            />
          )}
          {activeTab === 'meeting' && (
            <MeetingModule 
              setTasks={setTasks} 
              setUserBookings={setUserBookings} 
              userBookings={userBookings}
              setNotification={setNotification}
              onBack={() => setActiveTab('home')}
              selectedMeeting={selectedMeeting}
            />
          )}
          {activeTab === 'approval' && (
            <ApprovalModule 
              approvals={approvals}
              setApprovals={setApprovals}
              setNotification={setNotification}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === 'document' && (
            <DocumentModule 
              onManage={() => setActiveTab('doc_admin')} 
              onBack={() => setActiveTab('home')}
            />
          )}
          {activeTab === 'doc_admin' && (
            <DocumentAdminModule onBack={() => setActiveTab('home')} />
          )}
          {activeTab === 'attendance' && (
            <AttendanceModule 
              isTripDay={isTripDay}
              setNotification={setNotification}
              attendanceRecord={attendanceRecord}
              setAttendanceRecord={setAttendanceRecord}
              forgotClockIn={forgotClockIn}
              setApprovals={setApprovals}
              onTeamManage={() => setActiveTab('team_attendance')}
              onBack={() => setActiveTab('home')}
            />
          )}
          {activeTab === 'team_attendance' && (
            <TeamAttendanceModule onBack={() => setActiveTab('attendance')} />
          )}
          {activeTab === 'travel' && (
            <TravelModule 
              setApprovals={setApprovals}
              setNotification={setNotification}
              setActiveTab={setActiveTab}
              itineraries={itineraries}
              setItineraries={setItineraries}
            />
          )}
          {activeTab === 'reimbursement' && (
            <ReimbursementModule 
              setApprovals={setApprovals}
              setNotification={setNotification}
              setActiveTab={setActiveTab}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
