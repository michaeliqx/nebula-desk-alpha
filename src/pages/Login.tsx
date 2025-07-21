import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspace } from "@/hooks/useWorkspace";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import techBg from "@/assets/tech-bg.jpg";

const Login = () => {
  const navigate = useNavigate();
  const { hasWorkspaces, lastOpenedWorkspace, switchWorkspace, loading } = useWorkspace();

  // 移除自动跳转逻辑，让用户手动选择登录或快速体验

  const handleLogin = () => {
    navigate("/auth");
  };

  const handleQuickStart = () => {
    navigate("/projects");
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${techBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
      
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-violet-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-32 right-32 w-40 h-40 bg-violet-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-violet-300/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Logo and title */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="w-16 h-16 bg-violet-400/20 rounded-2xl mx-auto mb-4 flex items-center justify-center glow">
          <div className="w-8 h-8 bg-violet-500 rounded-lg animate-glow"></div>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-500 to-violet-400 bg-clip-text text-transparent">
          算力云桌面
        </h1>
        <p className="text-gray-600 mt-2">强大的云端计算体验</p>
      </div>

      {/* Login form */}
      <Card className="glass-card p-8 animate-slide-in bg-white/70 backdrop-blur-xl border border-violet-200">
          <div className="space-y-6">
            <div className="flex gap-4">
              <Button 
                onClick={handleLogin}
                className="flex-1 btn-premium"
                size="lg"
              >
                登录账户
              </Button>
              
              <Button 
                onClick={handleQuickStart}
                variant="outline"
                className="flex-1 glass-button"
                size="lg"
              >
                快速体验
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                登录以保存您的工作空间和设置
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              使用即表示同意 
              <span className="text-primary cursor-pointer hover:underline">用户协议</span> 和 
              <span className="text-primary cursor-pointer hover:underline">隐私政策</span>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;