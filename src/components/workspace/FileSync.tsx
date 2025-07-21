import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, RefreshCw, CheckCircle, TrendingUp, FolderIcon, Download, Upload as UploadIcon, Trash2, AlertCircle } from "lucide-react";
import { useState } from "react";
export const FileSync = () => {
  const [selectedStorage, setSelectedStorage] = useState("s3");
  const stats = [{
    label: "Active Syncs",
    value: "2",
    icon: RefreshCw,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20"
  }, {
    label: "Completed",
    value: "156",
    icon: CheckCircle,
    color: "text-green-400",
    bgColor: "bg-green-500/20"
  }, {
    label: "Data Synced",
    value: "2.3TB",
    icon: UploadIcon,
    color: "text-purple-400",
    bgColor: "bg-purple-500/20"
  }, {
    label: "Avg Speed",
    value: "34MB/s",
    icon: TrendingUp,
    color: "text-orange-400",
    bgColor: "bg-orange-500/20"
  }];
  const syncOperations = [{
    id: "1",
    name: "datasets/imagenet-2022",
    path: "S3: ml-datasets-bucket",
    status: "completed",
    size: "150GB",
    speed: "45 MB/s",
    timeLeft: "Completed",
    started: "2 hours ago"
  }, {
    id: "2",
    name: "models/bert-large",
    path: "Local: /workspace/models",
    status: "in-progress",
    size: "3.2GB",
    speed: "23 MB/s",
    timeLeft: "2 minutes",
    started: "5 minutes ago",
    progress: 85
  }, {
    id: "3",
    name: "code/training-scripts",
    path: "WebDAV: lab-storage.com",
    status: "pending",
    size: "245MB",
    speed: "Waiting...",
    timeLeft: "Queued",
    started: "Just now"
  }, {
    id: "4",
    name: "outputs/experiment-results",
    path: "S3: results-bucket",
    status: "error",
    size: "1.8GB",
    speed: "Failed",
    timeLeft: "Connection timeout",
    started: "10 minutes ago"
  }];
  const storageOptions = [{
    id: "s3",
    name: "S3 Bucket (ml-datasets)",
    selected: true
  }, {
    id: "webdav",
    name: "WebDAV (lab-storage.com)",
    selected: false
  }, {
    id: "local",
    name: "Local Workspace",
    selected: false
  }];
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400";
      case "in-progress":
        return "text-blue-400";
      case "pending":
        return "text-orange-400";
      case "error":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">In Progress</Badge>;
      case "pending":
        return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Pending</Badge>;
      case "error":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Error</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Unknown</Badge>;
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "in-progress":
        return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-orange-400" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };
  return <div className="space-y-6 p-6 bg-white rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-violet-800 mb-2">文件同步</h1>
          <p className="text-gray-600 text-lg">本地存储与云端存储文件同步操作</p>
        </div>
        <Button className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-6">
          + 添加同步任务
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Upload */}
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-xl p-6 border border-violet-100">
          <div className="flex items-center gap-3 mb-6">
            <Upload className="w-6 h-6 text-violet-600" />
            <h2 className="text-xl font-semibold text-violet-800">快速上传</h2>
          </div>
          <p className="text-gray-600 text-base mb-4">将文件拖拽到这里或点击进行浏览</p>
          
          {/* Upload Area */}
          <div className="border-2 border-dashed border-violet-200 rounded-xl p-8 text-center mb-6 hover:border-violet-400 transition-colors cursor-pointer bg-violet-50/50">
            <FolderIcon className="w-12 h-12 text-violet-500 mx-auto mb-4" />
            <p className="text-violet-700 text-lg font-medium mb-2">在此处拖拽文件</p>
            <p className="text-gray-600 text-base mb-4">或点击进行浏览</p>
            <Button className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-6">
              浏览文件
            </Button>
          </div>

          {/* Storage Options */}
          <div>
            <h3 className="text-lg font-semibold text-violet-800 mb-3">储存选项</h3>
            <div className="space-y-3">
              {storageOptions.map(option => <div key={option.id} className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all duration-200 ${selectedStorage === option.id ? 'bg-violet-50 border border-violet-200' : 'bg-white border border-violet-100 hover:bg-violet-50/50'}`} onClick={() => setSelectedStorage(option.id)}>
                  <div className={`w-4 h-4 rounded-full border-2 ${selectedStorage === option.id ? 'border-violet-600 bg-violet-600' : 'border-violet-300'}`}>
                    {selectedStorage === option.id && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                  </div>
                  <span className="text-violet-800 font-medium">{option.name}</span>
                </div>)}
            </div>
          </div>
        </Card>

        {/* Sync Operations */}
        <Card className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <RefreshCw className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">同步操作</h2>
          </div>
          <p className="text-gray-400 text-sm mb-4">监控您的文件同步任务</p>

          <div className="space-y-4">
            {syncOperations.map(operation => <Card key={operation.id} className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(operation.status)}
                    <div>
                      <h4 className="text-white font-medium text-sm">{operation.name}</h4>
                      <p className="text-gray-400 text-xs">{operation.path}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(operation.status)}
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-1">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {operation.status === 'in-progress' && operation.progress && <div className="mb-3">
                    <Progress value={operation.progress} className="h-1.5" />
                  </div>}

                <div className="grid grid-cols-4 gap-4 text-xs">
                  <div>
                    <div className="text-gray-400 mb-1">Size</div>
                    <p className="text-white font-medium">{operation.size}</p>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Speed</div>
                    <p className="text-white font-medium">{operation.speed}</p>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Time Left</div>
                    <p className="text-white font-medium">{operation.timeLeft}</p>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Started</div>
                    <p className="text-white font-medium">{operation.started}</p>
                  </div>
                </div>
              </Card>)}
          </div>
        </Card>
      </div>
    </div>;
};