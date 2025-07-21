import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WorkspaceIconGrid } from "./WorkspaceIconGrid";
import { Activity, Cpu, HardDrive, Zap, Users, Calendar, Clock, Server, BarChart3, Settings, Plus, Shuffle, Home } from "lucide-react";
interface WorkspaceManagementProps {
  currentWorkspace: any;
  onNavigate?: (nav: string) => void;
}
export const WorkspaceManagement = ({
  currentWorkspace,
  onNavigate
}: WorkspaceManagementProps) => {
  // 模拟工作空间状态数据
  const workspaceStatus = {
    isRunning: true,
    uptime: "2天 14小时",
    cpuUsage: 65,
    memoryUsage: 72,
    storageUsage: 45,
    activeUsers: 3,
    totalTasks: 8,
    completedTasks: 5,
    lastActivity: "5分钟前"
  };
  const getStatusColor = (isRunning: boolean) => {
    return isRunning ? "bg-green-500" : "bg-red-500";
  };
  const getUsageColor = (usage: number) => {
    if (usage < 50) return "text-green-400";
    if (usage < 80) return "text-yellow-400";
    return "text-red-400";
  };
  return <div className="p-6 space-y-6 bg-white rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-violet-800">工作空间管理</h2>
          <p className="text-gray-600 text-lg mt-2">管理和配置您的工作空间</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg" className="text-violet-600 border-violet-200 hover:bg-violet-50 font-medium">
            <Shuffle className="w-5 h-5 mr-2" />
            切换空间
          </Button>
          <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white font-medium">
            <Plus className="w-5 h-5 mr-2" />
            新建空间
          </Button>
        </div>
      </div>

      {/* 工作空间卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 当前工作空间卡片 */}
        <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl p-6 border border-violet-100 relative group">
          <div className="absolute top-4 right-4">
            <Badge className="bg-violet-100 text-violet-700 border-violet-200 font-medium">
              当前空间
            </Badge>
          </div>
          
          {/* 悬停蒙版 */}
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
            <div className="flex gap-3">
              <Button variant="outline" className="text-violet-700 border-violet-300 hover:bg-violet-50 font-medium">
                进入空间
              </Button>
              <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 font-medium">
                删除空间
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(workspaceStatus.isRunning)} animate-pulse`} />
            <h3 className="text-xl font-semibold text-violet-800">
              {currentWorkspace?.name || "默认工作空间"}
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">运行时间</span>
              <span className="text-violet-700 font-medium">{workspaceStatus.uptime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">CPU 使用率</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-violet-100 rounded-full">
                  <div 
                    className="h-2 bg-violet-600 rounded-full"
                    style={{ width: `${workspaceStatus.cpuUsage}%` }}
                  />
                </div>
                <span className="text-violet-700 font-medium">{workspaceStatus.cpuUsage}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">内存使用率</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-violet-100 rounded-full">
                  <div 
                    className="h-2 bg-violet-600 rounded-full"
                    style={{ width: `${workspaceStatus.memoryUsage}%` }}
                  />
                </div>
                <span className="text-violet-700 font-medium">{workspaceStatus.memoryUsage}%</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-violet-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">活跃用户</span>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  {workspaceStatus.activeUsers} 在线
                </Badge>
              </div>
              <span className="text-sm text-gray-500">最后活动：{workspaceStatus.lastActivity}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>;
};