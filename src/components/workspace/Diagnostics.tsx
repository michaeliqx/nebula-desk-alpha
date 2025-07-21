import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Wifi, Server, TrendingUp, Zap, AlertTriangle, Clock, Activity } from "lucide-react";
export const Diagnostics = () => {
  const stats = [{
    label: "System Status",
    value: "Healthy",
    icon: CheckCircle,
    color: "text-green-400",
    bgColor: "bg-green-500/20"
  }, {
    label: "Network",
    value: "45ms",
    icon: Wifi,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20"
  }, {
    label: "Services",
    value: "4/4",
    icon: Server,
    color: "text-purple-400",
    bgColor: "bg-purple-500/20"
  }, {
    label: "Uptime",
    value: "99.9%",
    icon: TrendingUp,
    color: "text-orange-400",
    bgColor: "bg-orange-500/20"
  }];
  const connectivityTests = [{
    id: "1",
    name: "Network Connectivity",
    description: "Testing connection to cloud services",
    detail: "All endpoints responding normally",
    status: "passed",
    duration: "45ms"
  }, {
    id: "2",
    name: "Authentication",
    description: "Verifying user credentials",
    detail: "Token valid, permissions verified",
    status: "passed",
    duration: "120ms"
  }, {
    id: "3",
    name: "Storage Access",
    description: "Testing S3 and WebDAV connections",
    detail: "S3 responding slowly, WebDAV timeout",
    status: "warning",
    duration: "890ms"
  }, {
    id: "4",
    name: "GPU Services",
    description: "Checking workspace availability",
    detail: "12 GPUs available, 2 in use",
    status: "passed",
    duration: "67ms"
  }];
  const systemMetrics = [{
    name: "CPU Usage",
    value: 23,
    color: "bg-blue-500"
  }, {
    name: "Memory",
    value: 45,
    color: "bg-green-500"
  }, {
    name: "Disk Usage",
    value: 78,
    color: "bg-orange-500"
  }];
  const networkTest = {
    downloadSpeed: "125.3 Mbps",
    uploadSpeed: "45.7 Mbps",
    ping: "12ms"
  };

  const diagnosticResults = [{
    name: "系统检查",
    status: "success",
    timestamp: "2分钟前",
    message: "所有系统服务运行正常",
    details: "CPU: 23% | 内存: 45% | 磁盘: 78%"
  }, {
    name: "网络连接",
    status: "warning",
    timestamp: "5分钟前",
    message: "检测到网络延迟波动",
    details: "延迟: 45ms | 下载: 125.3 Mbps | 上传: 45.7 Mbps"
  }, {
    name: "存储服务",
    status: "error",
    timestamp: "10分钟前",
    message: "S3存储连接超时",
    details: "错误代码: TIMEOUT_ERROR\n重试次数: 3"
  }];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed":
        return "text-green-400";
      case "warning":
        return "text-orange-400";
      case "failed":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      case "failed":
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "passed":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">PASSED</Badge>;
      case "warning":
        return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">WARNING</Badge>;
      case "failed":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">FAILED</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 text-xs">UNKNOWN</Badge>;
    }
  };
  return <div className="space-y-6 p-6 bg-white rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-violet-800 mb-2">诊断</h1>
          <p className="text-gray-600 text-lg">监控系统健康状态和排查连接问题</p>
        </div>
        <Button className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-6">
          ▶ 运行诊断
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

      {/* 诊断结果列表 */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-violet-800 mb-4">诊断历史</h2>
        <div className="space-y-4">
          {diagnosticResults.map((result, index) => (
            <Card key={index} className="bg-white p-4 border border-violet-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    result.status === 'success' ? 'bg-green-500' : 
                    result.status === 'warning' ? 'bg-yellow-500' : 
                    'bg-red-500'
                  }`} />
                  <span className="font-medium text-violet-800">{result.name}</span>
                </div>
                <span className="text-sm text-gray-500">{result.timestamp}</span>
              </div>
              <p className="mt-2 text-gray-600">{result.message}</p>
              {result.details && (
                <div className="mt-2 p-3 bg-violet-50 rounded-md">
                  <pre className="text-sm text-violet-700 whitespace-pre-wrap">{result.details}</pre>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>;
};