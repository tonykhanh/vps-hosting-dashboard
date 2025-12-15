
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Users, UserPlus, MoreHorizontal, Sparkles, Plus, ArrowRight, 
  MessageSquare, Shield, Code, Eye, Briefcase, Clock, X, Mail,
  CheckCircle2, GripVertical, Calendar, Trash2, Flag, User
} from 'lucide-react';
import { Button } from '../components/Button';

// --- Types ---
interface TeamMember {
  id: string;
  name: string;
  role: 'Admin' | 'Developer' | 'Viewer';
  status: 'online' | 'offline' | 'busy';
  avatar: string;
  email?: string;
}

interface Task {
  id: string;
  title: string;
  assigneeId?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  aiSuggested?: boolean;
}

interface Activity {
  id: string;
  userId: string;
  action: string;
  target: string;
  time: string;
}

// --- Constants ---
const MOCK_MEMBERS: TeamMember[] = [
  { id: 'u-1', name: 'John Doe', role: 'Admin', status: 'online', avatar: 'JD', email: 'john@example.com' },
  { id: 'u-2', name: 'Sarah Connor', role: 'Developer', status: 'busy', avatar: 'SC', email: 'sarah@example.com' },
  { id: 'u-3', name: 'Mike Ross', role: 'Viewer', status: 'offline', avatar: 'MR', email: 'mike@example.com' },
];

const MOCK_TASKS: Task[] = [
  { id: 't-1', title: 'Review PR #402', assigneeId: 'u-1', status: 'in_progress', priority: 'high', dueDate: 'Today' },
  { id: 't-2', title: 'Update API Docs', assigneeId: 'u-2', status: 'todo', priority: 'medium', dueDate: 'Tomorrow' },
  { id: 't-3', title: 'Fix CSS on Login', assigneeId: 'u-2', status: 'done', priority: 'low', dueDate: 'Yesterday' },
];

const MOCK_ACTIVITIES: Activity[] = [
  { id: 'a-1', userId: 'u-1', action: 'deployed', target: 'Production', time: '10m ago' },
  { id: 'a-2', userId: 'u-2', action: 'committed', target: 'feature/auth', time: '1h ago' },
  { id: 'a-3', userId: 'u-1', action: 'changed role', target: 'Mike Ross', time: '2h ago' },
];

const MOCK_SUGGESTIONS = [
  { 
    id: 's-1', 
    msg: 'Database CPU is high. Assign optimization task to Sarah?',
    taskTitle: 'Optimize DB Queries',
    targetUser: 'u-2' 
  }
];

// --- Helpers ---
const getRoleIcon = (role: string) => {
  switch(role) {
    case 'Admin': return <Shield size={14} />;
    case 'Developer': return <Code size={14} />;
    default: return <Eye size={14} />;
  }
};

const getPriorityColor = (p: string) => {
  switch(p) {
    case 'high': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
    case 'medium': return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
    default: return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
  }
};

const getRelativeLabel = (date: Date): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  // Compare date parts only for Today/Tomorrow logic
  const dZero = new Date(d);
  dZero.setHours(0, 0, 0, 0);
  
  const diffTime = dZero.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  // Format time HH:mm
  const timeStr = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  if (diffDays === 0) return `Today, ${timeStr}`;
  if (diffDays === 1) return `Tomorrow, ${timeStr}`;
  if (diffDays === 7) return `Next Week, ${timeStr}`;
  
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + `, ${timeStr}`;
};

const getDatePickerValue = (dateString: string) => {
  const today = new Date();
  let targetDate = new Date();
  
  // Set default time to 09:00 for task due dates if not specified
  targetDate.setHours(9, 0, 0, 0);

  const lower = dateString?.toLowerCase() || '';

  if (lower.includes('today')) {
      // keep targetDate as today
  } else if (lower.includes('tomorrow')) {
      targetDate.setDate(today.getDate() + 1);
  } else if (lower.includes('next week')) {
      targetDate.setDate(today.getDate() + 7);
  } else if (!dateString || lower.includes('no date')) {
      return '';
  } else {
      // Try parsing the full string
      const parsed = new Date(dateString);
      if (!isNaN(parsed.getTime())) {
          targetDate = parsed;
      }
  }

  // If the label has a specific time (comma separated usually from getRelativeLabel), parse it
  if (dateString && dateString.includes(',')) {
      const timePart = dateString.split(',')[1].trim();
      const [hours, minutes] = timePart.split(':').map(Number);
      if (!isNaN(hours) && !isNaN(minutes)) {
          targetDate.setHours(hours);
          targetDate.setMinutes(minutes);
      }
  } else if (!dateString.includes('Today') && !dateString.includes('Tomorrow') && !dateString.includes('Next Week')) {
      // If it's a raw date string without time info, it might default to midnight, let's keep 09:00 default
  }
  
  const yyyy = targetDate.getFullYear();
  const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
  const dd = String(targetDate.getDate()).padStart(2, '0');
  const hh = String(targetDate.getHours()).padStart(2, '0');
  const min = String(targetDate.getMinutes()).padStart(2, '0');
  
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
};

// --- Sub-Components ---

const TeamMemberRow: React.FC<{ member: TeamMember }> = ({ member }) => (
  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/50 dark:hover:bg-neutral-700/50 transition-colors group cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-white/5">
     <div className="flex items-center gap-3">
        <div className="relative">
           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 dark:from-neutral-700 dark:to-neutral-600 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 text-sm shadow-inner">
              {member.avatar}
           </div>
           <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-white dark:border-neutral-800 rounded-full ${
              member.status === 'online' ? 'bg-green-500' : 
              member.status === 'busy' ? 'bg-red-500' : 'bg-gray-400'
           }`}></div>
        </div>
        <div>
           <div className="font-bold text-gray-900 dark:text-white text-sm">{member.name}</div>
           <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              {getRoleIcon(member.role)} {member.role}
           </div>
        </div>
     </div>
     <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-plasma-600 transition-opacity">
        <MessageSquare size={16} />
     </button>
  </div>
);

const TaskCard: React.FC<{ 
  task: Task; 
  members: TeamMember[]; 
  onDragStart: (e: React.DragEvent, id: string) => void; 
  onDelete: (id: string) => void;
}> = ({ task, members, onDragStart, onDelete }) => (
  <div 
    draggable 
    onDragStart={(e) => onDragStart(e, task.id)}
    className="bg-white dark:bg-neutral-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-700 hover:shadow-md transition-all cursor-grab active:cursor-grabbing relative group hover:border-plasma-300 dark:hover:border-plasma-500/50"
  >
     {/* Header Row */}
     <div className="flex justify-between items-start mb-3">
       <div className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${getPriorityColor(task.priority)}`}>
          {task.priority}
       </div>
       
       {/* Static Indicator (Visible when NOT hovering) */}
       <div className="flex items-center gap-2 group-hover:opacity-0 transition-opacity duration-200">
          {task.aiSuggested && (
             <div className="text-indigo-500" title="AI Suggested">
                <Sparkles size={14} />
             </div>
          )}
       </div>
     </div>

     {/* Hover Toolbar (Absolute Top Right) */}
     <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm p-1 rounded-lg border border-gray-100 dark:border-neutral-700 shadow-sm z-10">
        {task.aiSuggested && (
           <div className="p-1.5 text-indigo-500 border-r border-gray-100 dark:border-neutral-700 mr-0.5">
              <Sparkles size={14} />
           </div>
        )}
        <button 
           onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
           className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
           title="Delete"
        >
           <Trash2 size={14} />
        </button>
        <div className="p-1.5 text-gray-300 hover:text-gray-500 dark:text-neutral-500 dark:hover:text-neutral-300 cursor-grab">
           <GripVertical size={14} />
        </div>
     </div>
     
     <h4 className="text-base font-bold text-gray-900 dark:text-white mb-4 leading-snug">{task.title}</h4>
     
     <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-neutral-700/50">
        <div className="flex items-center gap-2">
           <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-neutral-700 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300 border border-white dark:border-neutral-600 shadow-sm">
              {members.find(m => m.id === task.assigneeId)?.avatar || '?'}
           </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium bg-gray-50 dark:bg-neutral-700/30 px-2 py-1 rounded">
           <Clock size={12} /> {task.dueDate}
        </div>
     </div>
  </div>
);

const ActivityItem: React.FC<{ activity: Activity; members: TeamMember[] }> = ({ activity, members }) => (
  <div className="relative pl-10">
     <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300 z-10 shadow-sm">
        {members.find(m => m.id === activity.userId)?.avatar}
     </div>
     
     <div className="text-sm">
        <span className="font-bold text-gray-900 dark:text-white">{members.find(m => m.id === activity.userId)?.name}</span>
        <span className="text-gray-500 dark:text-gray-400"> {activity.action} </span>
        <span className="font-medium text-plasma-600 dark:text-plasma-400">{activity.target}</span>
     </div>
     <div className="text-xs text-gray-400 mt-1">{activity.time}</div>
  </div>
);

// --- Main Component ---

export const Team: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>(MOCK_MEMBERS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES);
  const [aiSuggestions, setAiSuggestions] = useState(MOCK_SUGGESTIONS);

  // Modal States
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  
  // Forms
  const [newTaskStatus, setNewTaskStatus] = useState<'todo' | 'in_progress' | 'done'>('todo');
  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    assigneeId: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    dueDate: 'Tomorrow'
  });
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'Viewer' as 'Admin' | 'Developer' | 'Viewer'
  });

  // Drag & Drop State
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);

  // -- Handlers --

  const handleAssignSuggestion = (id: string) => {
    const suggestion = aiSuggestions.find(s => s.id === id);
    if (!suggestion) return;

    const newTask: Task = {
      id: `t-${Date.now()}`,
      title: suggestion.taskTitle,
      assigneeId: suggestion.targetUser,
      status: 'todo',
      priority: 'high',
      dueDate: 'ASAP',
      aiSuggested: true
    };

    setTasks([newTask, ...tasks]);
    setAiSuggestions(prev => prev.filter(s => s.id !== id));
    
    // Add activity log
    setActivities(prev => [{
        id: `a-${Date.now()}`,
        userId: 'u-1', // Assuming current user
        action: 'approved AI task',
        target: suggestion.taskTitle,
        time: 'Just now'
    }, ...prev]);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggingTaskId(id);
    e.dataTransfer.effectAllowed = "move";
    // Transparent drag image hack if needed, or simple styling
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    if (!draggingTaskId) return;

    setTasks(prev => prev.map(t => 
      t.id === draggingTaskId ? { ...t, status } : t
    ));
    setDraggingTaskId(null);
  };

  const handleDeleteTask = (id: string) => {
      setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleInvite = () => {
    if (!inviteForm.email) return;
    
    const newMember: TeamMember = {
      id: `u-${Date.now()}`,
      name: inviteForm.email.split('@')[0], // Simple name extraction
      role: inviteForm.role,
      status: 'offline',
      avatar: inviteForm.email.substring(0, 2).toUpperCase(),
      email: inviteForm.email
    };

    setMembers([...members, newMember]);
    setShowInviteModal(false);
    setInviteForm({ email: '', role: 'Viewer' });
  };

  const handleAddTask = () => {
    if (!newTaskForm.title) return;

    const newTask: Task = {
      id: `t-${Date.now()}`,
      title: newTaskForm.title,
      assigneeId: newTaskForm.assigneeId,
      status: newTaskStatus,
      priority: newTaskForm.priority,
      dueDate: newTaskForm.dueDate
    };

    setTasks([...tasks, newTask]);
    setShowAddTaskModal(false);
    setNewTaskForm({ title: '', assigneeId: '', priority: 'medium', dueDate: 'Tomorrow' });
  };

  const openAddTask = (status: Task['status']) => {
    setNewTaskStatus(status);
    setShowAddTaskModal(true);
  };

  return (
    <>
      <div className="space-y-8 pb-20 relative h-full">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              <Users className="text-plasma-600" size={32} />
              Team & Collaboration
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage roles, assign tasks, and track activity with AI assistance.
            </p>
          </div>
          <Button onClick={() => setShowInviteModal(true)}>
             <UserPlus size={18} className="mr-2" /> Invite Member
          </Button>
        </div>

        {/* AI Dispatcher Panel */}
        {aiSuggestions.length > 0 && (
          <div className="bg-gradient-to-r from-indigo-50 to-white dark:from-neutral-800 dark:to-neutral-900 border border-indigo-100 dark:border-indigo-900/30 rounded-3xl p-6 shadow-sm flex items-center justify-between animate-in slide-in-from-top-4">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                   <Sparkles size={24} />
                </div>
                <div>
                   <h3 className="font-bold text-indigo-900 dark:text-indigo-200">AI Workload Analysis</h3>
                   <p className="text-indigo-700 dark:text-indigo-300 text-sm">{aiSuggestions[0].msg}</p>
                </div>
             </div>
             <div className="flex gap-2">
                <Button size="sm" variant="secondary" className="dark:bg-neutral-700 dark:text-gray-300" onClick={() => setAiSuggestions(prev => prev.slice(1))}>Dismiss</Button>
                <Button size="sm" onClick={() => handleAssignSuggestion(aiSuggestions[0].id)}>
                   Approve Assignment <ArrowRight size={16} className="ml-2" />
                </Button>
             </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-auto lg:h-[calc(100vh-250px)]">
          
          {/* Left Column: Team Roster */}
          <div className="lg:col-span-3 space-y-6">
             <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl p-6 shadow-glass h-full">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">Members ({members.length})</h3>
                   <button className="text-plasma-600 hover:bg-plasma-50 dark:hover:bg-white/10 p-1 rounded transition-colors"><MoreHorizontal size={16}/></button>
                </div>

                <div className="space-y-4">
                   {members.map(member => (
                      <TeamMemberRow key={member.id} member={member} />
                   ))}
                </div>
             </div>
          </div>

          {/* Center Column: Kanban Board */}
          <div className="lg:col-span-6 flex flex-col h-full overflow-hidden">
             <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto pb-4 custom-scrollbar">
                {(['todo', 'in_progress', 'done'] as const).map(status => {
                   const filteredTasks = tasks.filter(t => t.status === status);
                   return (
                     <div 
                        key={status} 
                        className="flex flex-col gap-4 min-h-[200px]"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, status)}
                     >
                        <div className="flex items-center justify-between mb-2 px-2">
                           <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">{status.replace('_', ' ')}</h3>
                           <span className="bg-gray-200 dark:bg-neutral-700 text-gray-600 dark:text-gray-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                              {filteredTasks.length}
                           </span>
                        </div>
                        
                        <div className={`bg-gray-50/50 dark:bg-neutral-800/30 rounded-3xl p-3 flex flex-col gap-3 flex-1 border transition-colors ${draggingTaskId ? 'border-dashed border-plasma-400 bg-plasma-50/20' : 'border-gray-100/50 dark:border-white/5'}`}>
                           {filteredTasks.map(task => (
                              <TaskCard 
                                key={task.id} 
                                task={task} 
                                members={members} 
                                onDragStart={handleDragStart}
                                onDelete={handleDeleteTask}
                              />
                           ))}
                           
                           <button 
                              onClick={() => openAddTask(status)}
                              className="p-4 border-2 border-dashed border-gray-200 dark:border-neutral-700 rounded-2xl text-gray-400 hover:border-plasma-300 hover:text-plasma-500 hover:bg-plasma-50/30 dark:hover:bg-plasma-900/10 transition-all flex items-center justify-center gap-2 text-xs font-bold"
                           >
                              <Plus size={16} /> Add Task
                           </button>
                        </div>
                     </div>
                   );
                })}
             </div>
          </div>

          {/* Right Column: Activity Feed */}
          <div className="lg:col-span-3 space-y-6">
             <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl p-6 shadow-glass h-full flex flex-col">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-6 flex items-center gap-2">
                   <Briefcase size={16} /> Activity Stream
                </h3>
                
                <div className="space-y-6 relative flex-1 overflow-y-auto custom-scrollbar pr-2">
                   <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-neutral-700"></div>
                   
                   {activities.map(act => (
                      <ActivityItem key={act.id} activity={act} members={members} />
                   ))}
                   
                   <div className="relative pl-10 opacity-50">
                      <div className="absolute left-1 top-1 w-6 h-6 rounded-full bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 z-10"></div>
                      <div className="h-4 bg-gray-100 dark:bg-neutral-800 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-100 dark:bg-neutral-800 rounded w-1/2"></div>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>

      {/* --- Invite Member Modal --- */}
      {showInviteModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowInviteModal(false)} />
           <div className="relative bg-white dark:bg-neutral-900 w-full max-w-md rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-neutral-700 z-10">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
                    <UserPlus size={20} className="text-plasma-600" /> Invite Team Member
                 </h3>
                 <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={20}/></button>
              </div>
              
              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                    <div className="relative">
                       <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                       <input 
                          type="email" 
                          placeholder="colleague@company.com"
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl outline-none dark:text-white focus:ring-2 focus:ring-plasma-500"
                          value={inviteForm.email}
                          onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
                          autoFocus
                       />
                    </div>
                 </div>
                 
                 <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Role</label>
                    <div className="grid grid-cols-3 gap-2">
                       {['Viewer', 'Developer', 'Admin'].map(role => (
                          <button
                             key={role}
                             onClick={() => setInviteForm({...inviteForm, role: role as any})}
                             className={`py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                                inviteForm.role === role 
                                   ? 'border-plasma-500 bg-plasma-50 dark:bg-plasma-900/30 text-plasma-700 dark:text-plasma-400' 
                                   : 'border-gray-100 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600 text-gray-500'
                             }`}
                          >
                             {role}
                          </button>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-neutral-800">
                 <Button variant="secondary" onClick={() => setShowInviteModal(false)} className="dark:bg-neutral-800 dark:text-white dark:border-neutral-700">Cancel</Button>
                 <Button onClick={handleInvite} disabled={!inviteForm.email} className="shadow-lg shadow-plasma-500/20">Send Invite</Button>
              </div>
           </div>
        </div>,
        document.body
      )}

      {/* --- Add Task Modal --- */}
      {showAddTaskModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowAddTaskModal(false)} />
           <div className="relative bg-white dark:bg-neutral-900 w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden border border-gray-200 dark:border-neutral-700 z-10 flex flex-col">
              
              {/* Header */}
              <div className="p-8 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                 <h3 className="font-bold text-2xl text-gray-900 dark:text-white flex items-center gap-3">
                    <div className="p-3 bg-plasma-100 dark:bg-plasma-900/30 rounded-2xl text-plasma-600 dark:text-plasma-400">
                        <CheckCircle2 size={24} />
                    </div>
                    New Task
                 </h3>
                 <button onClick={() => setShowAddTaskModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors"><X size={24}/></button>
              </div>
              
              <div className="p-8 space-y-8">
                 {/* Title Input - Large */}
                 <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Task Description</label>
                    <input 
                       type="text" 
                       placeholder="What needs to be done?"
                       className="w-full text-3xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-700 p-0 focus:ring-0"
                       value={newTaskForm.title}
                       onChange={(e) => setNewTaskForm({...newTaskForm, title: e.target.value})}
                       autoFocus
                    />
                 </div>

                 {/* Assignee Selection - Avatars */}
                 <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <User size={14} /> Assignee
                    </label>
                    <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                        <button 
                            onClick={() => setNewTaskForm({...newTaskForm, assigneeId: ''})}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all shrink-0 ${!newTaskForm.assigneeId ? 'border-plasma-500 bg-plasma-50 dark:bg-plasma-900/20 text-plasma-700 dark:text-plasma-400' : 'border-gray-100 dark:border-neutral-700 text-gray-500 hover:border-gray-300'}`}
                        >
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-600 flex items-center justify-center text-xs font-bold">?</div>
                            <span className="text-sm font-bold">Unassigned</span>
                        </button>
                        {members.map(m => (
                            <button 
                                key={m.id}
                                onClick={() => setNewTaskForm({...newTaskForm, assigneeId: m.id})}
                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all shrink-0 ${newTaskForm.assigneeId === m.id ? 'border-plasma-500 bg-plasma-50 dark:bg-plasma-900/20 text-plasma-700 dark:text-plasma-400' : 'border-gray-100 dark:border-neutral-700 text-gray-500 hover:border-gray-300'}`}
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 dark:from-neutral-700 dark:to-neutral-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 shadow-inner">
                                    {m.avatar}
                                </div>
                                <span className="text-sm font-bold">{m.name.split(' ')[0]}</span>
                            </button>
                        ))}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-8">
                    {/* Priority - Buttons */}
                    <div>
                       <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Flag size={14} /> Priority
                       </label>
                       <div className="flex flex-col gap-3">
                          {['low', 'medium', 'high'].map(p => (
                              <button 
                                key={p}
                                onClick={() => setNewTaskForm({...newTaskForm, priority: p as any})}
                                className={`px-5 py-3 rounded-xl text-sm font-bold capitalize text-left border-2 transition-all flex items-center justify-between ${
                                    newTaskForm.priority === p 
                                    ? (p === 'high' ? 'border-red-500 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : p === 'medium' ? 'border-amber-500 bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' : 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400') 
                                    : 'border-gray-100 dark:border-neutral-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-neutral-800'
                                }`}
                              >
                                {p}
                                {newTaskForm.priority === p && <div className={`w-2.5 h-2.5 rounded-full ${p === 'high' ? 'bg-red-500' : p === 'medium' ? 'bg-amber-500' : 'bg-blue-500'}`} />}
                              </button>
                          ))}
                       </div>
                    </div>

                    {/* Due Date - Quick Select & Custom Time */}
                    <div>
                       <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Calendar size={14} /> Due Date & Time
                       </label>
                       <div className="grid grid-cols-2 gap-3">
                          {['Today', 'Tomorrow', 'Next Week', 'No Date'].map(date => (
                              <button 
                                key={date}
                                onClick={() => setNewTaskForm({...newTaskForm, dueDate: date})}
                                className={`px-4 py-3 rounded-xl text-xs font-bold transition-all border border-transparent ${
                                    newTaskForm.dueDate.startsWith(date) 
                                    ? 'bg-gray-900 text-white dark:bg-white dark:text-black shadow-lg' 
                                    : 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-700'
                                }`}
                              >
                                {date}
                              </button>
                          ))}
                       </div>
                       <div className="relative mt-4">
                           <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <Calendar size={16} className="text-gray-400" />
                           </div>
                           <input 
                              type="datetime-local" 
                              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-sm focus:ring-2 focus:ring-plasma-500 outline-none text-gray-900 dark:text-white transition-colors cursor-pointer"
                              value={getDatePickerValue(newTaskForm.dueDate)}
                              onChange={(e) => {
                                  if (!e.target.value) {
                                      setNewTaskForm({...newTaskForm, dueDate: 'No Date'});
                                      return;
                                  }
                                  const date = new Date(e.target.value);
                                  setNewTaskForm({...newTaskForm, dueDate: getRelativeLabel(date)});
                              }}
                           />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-8 border-t border-gray-100 dark:border-neutral-800 flex justify-end gap-4 bg-gray-50/50 dark:bg-white/5">
                 <Button variant="secondary" onClick={() => setShowAddTaskModal(false)} className="dark:bg-neutral-800 dark:text-white dark:border-neutral-700 px-6 py-3 text-sm">Cancel</Button>
                 <Button onClick={handleAddTask} disabled={!newTaskForm.title} className="shadow-lg shadow-plasma-500/20 px-10 py-3 text-sm">Create Task</Button>
              </div>
           </div>
        </div>,
        document.body
      )}
    </>
  );
};
