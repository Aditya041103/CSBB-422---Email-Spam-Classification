import React from "react";
import { formatSnippet } from "../utils";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Clock, Mail } from "lucide-react";

export default function EmailList({ items, openEmail }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
        <Mail className="h-8 w-8 mb-2 opacity-50" />
        <p className="text-sm">No emails here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((m) => {
        const senderInitial = m.from?.charAt(0).toUpperCase() || "?";
        const timeStr = new Date(m.ts || Date.now()).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        
        return (
          <Card
            key={m.id}
            className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:bg-blue-50/50 border border-blue-100 hover:border-blue-300"
            onClick={() => openEmail(m)}
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-sm font-medium bg-blue-100 text-blue-700">
                    {senderInitial}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm text-foreground truncate">
                      {m.subject || "(no subject)"}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                      <Clock className="h-3 w-3" />
                      {timeStr}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground truncate">
                      {m.from}
                    </span>
                    {m.label === "spam" && (
                      <Badge variant="destructive" className="text-xs py-0">
                        Spam
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-4">
                    {formatSnippet(m.body)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
