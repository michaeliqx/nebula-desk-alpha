import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Clock, CheckCircle, DollarSign, Zap, MoreHorizontal, X } from "lucide-react";
export const JobQueue = () => {
  const stats = [{
    label: "Running",
    value: "1",
    icon: Play,
    color: "text-green-400",
    bgColor: "bg-green-500/20"
  }, {
    label: "Queued",
    value: "1",
    icon: Clock,
    color: "text-orange-400",
    bgColor: "bg-orange-500/20"
  }, {
    label: "Completed",
    value: "23",
    icon: CheckCircle,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20"
  }, {
    label: "Total Cost",
    value: "$34.85",
    icon: DollarSign,
    color: "text-purple-400",
    bgColor: "bg-purple-500/20"
  }];
  const jobs = [{
    id: "1",
    name: "BERT Fine-tuning on IMDB",
    type: "ML-Training-v3",
    gpu: "Tesla V100",
    status: "running",
    progress: 78,
    runtime: "2h 45m",
    eta: "45m remaining",
    cost: "$23.50",
    gpuUsage: "94%",
    started: "3 hours ago"
  }, {
    id: "2",
    name: "Image Classification Training",
    type: "Computer-Vision-Dev",
    gpu: "RTX 4090",
    status: "queued",
    progress: 0,
    runtime: "0m",
    eta: "~3h 20m",
    cost: "$0.00",
    gpuUsage: "0%",
    started: "Queued 15m ago"
  }, {
    id: "3",
    name: "Neural Style Transfer",
    type: "Creative-AI",
    gpu: "RTX 3080",
    status: "completed",
    progress: 100,
    runtime: "1h 22m",
    eta: "Completed",
    cost: "$8.95",
    gpuUsage: "87%",
    started: "4 hours ago"
  }, {
    id: "4",
    name: "Large Model Inference",
    type: "Inference-Server",
    gpu: "Tesla A100",
    status: "failed",
    progress: 45,
    runtime: "13m",
    eta: "Failed - OOM",
    cost: "$2.40",
    gpuUsage: "65%",
    started: "1 hour ago"
  }];
  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "text-green-400";
      case "queued":
        return "text-orange-400";
      case "completed":
        return "text-blue-400";
      case "failed":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Running</Badge>;
      case "queued":
        return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Queued</Badge>;
      case "completed":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Completed</Badge>;
      case "failed":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Failed</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Unknown</Badge>;
    }
  };
  return <div className="space-y-6 p-6 bg-white rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-violet-800 mb-2">任务队列</h1>
          <p className="text-gray-600 text-lg">实时监控并管理您的任务运行情况</p>
        </div>
        <Button className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-6">
          + 新建任务
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-xl p-6 border border-violet-100">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-violet-600`} />
              </div>
              <div>
                <h3 className="font-medium text-gray-600 text-sm mb-1">{stat.label}</h3>
                <p className={`text-2xl font-bold text-violet-800`}>{stat.value}</p>
              </div>
            </div>
          </Card>)}
      </div>

      {/* Active Jobs */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-violet-800 mb-4">活动任务</h2>
        <div className="space-y-4">
          {jobs.map((job, index) => (
            <Card key={job.id} className="bg-white p-4 border border-violet-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    job.status === 'running' ? 'bg-green-500 animate-pulse' : 
                    job.status === 'queued' ? 'bg-yellow-500' : 
                    'bg-red-500'
                  }`} />
                  <span className="font-medium text-violet-800">{job.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{job.progress}%</span>
                  <Button variant="outline" size="sm" className="text-violet-600 border-violet-200 hover:bg-violet-50">
                    查看详情
                  </Button>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-violet-100 rounded-full h-2">
                  <div 
                    className="bg-violet-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${job.progress}%` }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>;
};