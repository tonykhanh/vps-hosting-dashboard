import React, { useState } from 'react';
import { 
  Users, UserPlus, MoreHorizontal, Sparkles, Plus, ArrowRight, 
  MessageSquare, Shield, Code, Eye, Briefcase, Clock
} from 'lucide-react';
import { Button } from '../components/Button';

// --- Types ---
interface TeamMember {
  id: string;
  name: string;
  role: 'Admin' | 'Developer' | 'Viewer';
  status: 'online' | 'offline' | 'busy';
  avatar: string;
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
  { id: 'u-1', name: 'John Doe', role: 'Admin', status: 'online', avatar: 'JD' },
  { id: 'u-2', name: 'Sarah Connor', role: 'Developer', status: 'busy', avatar: 'SC' },
  { id: 'u-3', name: 'Mike Ross', role: 'Viewer', status: 'offline', avatar: 'MR' },
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

const TaskCard: React.FC<{ task: Task; members: TeamMember[] }> = ({ task, members }) => (
  <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 hover:shadow-md transition-shadow cursor-pointer relative group">
     {task.aiSuggested && (
        <div className="absolute top-2 right-2 text-indigo-500" title="AI Suggested">
           <Sparkles size={12} />
        </div>
     )}
     <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-2 ${getPriorityColor(task.priority)}`}>
        {task.priority}
     </div>
     <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">{task.title}</h4>
     
     <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-neutral-700 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300 border border-white dark:border-neutral-600 shadow-sm">
              {members.find(m => m.id === task.assigneeId)?.avatar || '?'}
           </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-gray-400">
           <Clock size={10} /> {task.dueDate}
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

const KanbanColumn: React.FC<{ 
  status: 'todo' | 'in_progress' | 'done'; 
  tasks: Task[]; 
  members: TeamMember[] 
}> = ({ status, tasks, members }) => {
  const filteredTasks = tasks.filter(t => t.status === status);
  
  return (
    <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between mb-2 px-2">
           <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">{status.replace('_', ' ')}</h3>
           <span className="bg-gray-200 dark:bg-neutral-700 text-gray-600 dark:text-gray-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
              {filteredTasks.length}
           </span>
        </div>
        
        <div className="bg-gray-50/50 dark:bg-neutral-800/30 rounded-2xl p-2 min-h-[200px] border border-gray-100/50 dark:border-white/5 flex flex-col gap-3">
           {filteredTasks.map(task => (
              <TaskCard key={task.id} task={task} members={members} />
           ))}
           
           <button className="p-3 border-2 border-dashed border-gray-200 dark:border-neutral-700 rounded-xl text-gray-400 hover:border-plasma-300 hover:text-plasma-500 hover:bg-plasma-50/30 dark:hover:bg-plasma-900/10 transition-all flex items-center justify-center gap-2 text-xs font-bold">
              <Plus size={14} /> Add Task
           </button>
        </div>
     </div>
  );
};

// --- Main Component ---

export const Team: React.FC = () => {
  const [members] = useState<TeamMember[]>(MOCK_MEMBERS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [activities] = useState<Activity[]>(MOCK_ACTIVITIES);
  const [aiSuggestions, setAiSuggestions] = useState(MOCK_SUGGESTIONS);

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
  };

  return (
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
        <Button>
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
           <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto pb-4">
              {(['todo', 'in_progress', 'done'] as const).map(status => (
                 <KanbanColumn key={status} status={status} tasks={tasks} members={members} />
              ))}
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
  );
};