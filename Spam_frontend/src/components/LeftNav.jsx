import React from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { 
  Mail, 
  Trash2, 
  Edit, 
  User, 
  LogOut, 
  MoreVertical 
} from "lucide-react";

export default function LeftNav({ user, inbox, spam, activeFolder, setActiveFolder, setComposeOpen, handleSignOut }) {
  const userInitial = user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <div className="w-64 p-6 border-r h-full bg-gradient-to-b from-blue-100 to-blue-50 border-blue-200">
      <div className="mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-blue-900">
          <Mail className="h-7 w-7 text-blue-600" />
          MailBox
        </h2>
        <p className="text-xs text-blue-600 mt-1">Smart Email Manager</p>
      </div>

      <Button
        onClick={() => setComposeOpen(true)}
        className="w-full mb-6"
        size="lg"
      >
        <Edit className="h-4 w-4 mr-2" />
        Compose
      </Button>

      <nav className="space-y-2">
        <Button
          variant={activeFolder === "inbox" ? "default" : "ghost"}
          onClick={() => setActiveFolder("inbox")}
          className="w-full justify-start"
        >
          <Mail className="h-4 w-4 mr-3" />
          Inbox
          <Badge variant="secondary" className="ml-auto">
            {inbox.length}
          </Badge>
        </Button>

        <Button
          variant={activeFolder === "spam" ? "default" : "ghost"}
          onClick={() => setActiveFolder("spam")}
          className="w-full justify-start"
        >
          <Trash2 className="h-4 w-4 mr-3" />
          Spam
          <Badge variant="secondary" className="ml-auto">
            {spam.length}
          </Badge>
        </Button>
      </nav>

      <Separator className="my-6" />

      {user && (
        <div className="mt-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarFallback className="text-sm font-medium">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <div className="text-sm font-medium truncate">{user.email}</div>
                  <div className="text-xs text-muted-foreground">Online</div>
                </div>
                <MoreVertical className="h-4 w-4 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="focus:bg-muted">
                <User className="h-4 w-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="focus:bg-destructive/10 focus:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
