import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { CheckCircle, Mail, Shield, Zap } from "lucide-react";

export default function AuthPanel({ 
  authEmail, 
  setAuthEmail, 
  authPassword, 
  setAuthPassword, 
  handleSignIn, 
  handleSignUp, 
  statusMsg 
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-blue-200">
          <CardHeader className="text-center">
            <div className="text-5xl mb-3">📬</div>
            <CardTitle className="text-3xl text-blue-900">MailBox</CardTitle>
            <CardDescription className="text-blue-600">Smart Email Management with AI Classification</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value.trim())}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value.trim())}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1">
                  Sign In
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={handleSignUp} 
                  className="flex-1"
                >
                  Sign Up
                </Button>
              </div>
            </form>

            {statusMsg && (
              <div className={`p-3 rounded-lg text-sm text-center font-medium ${
                statusMsg.includes("failed") || statusMsg.includes("already") || statusMsg.includes("Invalid") || statusMsg.includes("wrong") 
                  ? "bg-destructive/10 text-destructive border border-destructive/20" 
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}>
                {statusMsg}
              </div>
            )}

            <Separator />
            
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-semibold">Features</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Badge variant="outline" className="justify-start gap-1 py-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span className="text-xs">Firebase Auth</span>
                </Badge>
                <Badge variant="outline" className="justify-start gap-1 py-2">
                  <Mail className="h-3 w-3 text-blue-500" />
                  <span className="text-xs">Smart Folders</span>
                </Badge>
                <Badge variant="outline" className="justify-start gap-1 py-2">
                  <Shield className="h-3 w-3 text-purple-500" />
                  <span className="text-xs">AI Classification</span>
                </Badge>
                <Badge variant="outline" className="justify-start gap-1 py-2">
                  <Zap className="h-3 w-3 text-orange-500" />
                  <span className="text-xs">Real-time Sync</span>
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
