
import os

file_path = '/Users/avnendramishra/Desktop/Lxwyer Up Tech/NyaaySathi/frontend/src/pages/UserDashboard.js'

# The interactive messaging UI (New content for Messages Tab)
interactive_messaging_ui = """              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                {/* Conversations List */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col shadow-sm">
                  <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                      <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input placeholder="Search conversations..." className="pl-10 bg-gray-50 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    {messages.length > 0 ? (
                      messages.map((chat, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => handleSelectChat(chat)}
                          className={`flex items-center space-x-3 p-4 cursor-pointer transition-all ${selectedChat?.other_user_id === chat.other_user_id ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50 border-l-4 border-transparent'
                          }`}>
                          <div className="relative flex-shrink-0">
                            <div className={`w-12 h-12 ${chat.avatar ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'} rounded-full flex items-center justify-center shadow-sm`}>
                              <span className="font-bold">{chat.avatar || '?'}</span>
                            </div>
                            {chat.online && (
                              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-bold text-gray-900 truncate">{chat.name}</h4>
                              <span className="text-xs text-gray-400 whitespace-nowrap">{new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="text-sm text-gray-500 truncate">{chat.message}</p>
                          </div>
                          {chat.unread > 0 && (
                            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-[10px] font-bold text-white">{chat.unread}</span>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                       <div className="p-8 text-center text-gray-500">
                         No messages yet.
                       </div>
                    )}
                  </div>
                </div>

                {/* Chat Window */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col shadow-sm">
                  {selectedChat ? (
                    <>
                      {/* Chat Header */}
                      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                              <span className="font-bold">{selectedChat.avatar || '?'}</span>
                            </div>
                            {selectedChat.online && (
                              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{selectedChat.name}</p>
                            <p className="text-xs text-green-600">Online • Your Legal Counsel</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
                            <ListChecks className="w-5 h-5 text-gray-500" />
                          </button>
                        </div>
                      </div>

                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                        <div className="flex items-center justify-center">
                          <span className="px-3 py-1 bg-gray-200 rounded-full text-xs text-gray-600">Today</span>
                        </div>

                        {chatHistory.map((msg, idx) => (
                          <div key={idx} className={`flex items-start space-x-3 ${msg.sender_id === user.id ? 'justify-end' : ''}`}>
                            {msg.sender_id !== user.id && (
                              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-bold">{selectedChat.avatar || '?'}</span>
                              </div>
                            )}
                            <div className={`max-w-[70%] ${msg.sender_id === user.id ? 'text-right' : ''}`}>
                              <div className={`p-4 shadow-sm rounded-2xl ${
                                msg.sender_id === user.id 
                                  ? 'bg-blue-600 text-white rounded-tr-none' 
                                  : 'bg-white border border-gray-200 text-gray-900 rounded-tl-none'
                              }`}>
                                <p className="text-sm">{msg.content}</p>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Message Input */}
                      <div className="p-4 border-t border-gray-200 bg-white">
                        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                          <button type="button" className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors pointer shadow-sm">
                            <span className="text-xl">📎</span>
                          </button>
                          <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 bg-gray-100 border-gray-200 rounded-full px-5 text-gray-900"
                          />
                          <Button type="submit" className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center">
                            <Send className="w-4 h-4 text-white" />
                          </Button>
                        </form>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-gray-50/50">
                      <MessageSquare className="w-16 h-16 mb-4 text-gray-300" />
                      <p className="text-lg font-medium">Select a conversation</p>
                      <p className="text-sm">Choose a chat from the list to start messaging</p>
                    </div>
                  )}
                </div>
              </div>"""

# The dashboard content I want to restore (Correct Dashboard UI)
dashboard_ui = """            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500">Welcome back, {user?.full_name}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                 <div className="flex items-center justify-between mb-4">
                   <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                     <Gavel className="w-6 h-6 text-blue-600" />
                   </div>
                   <span className="text-xs font-semibold px-2 py-1 bg-green-50 text-green-600 rounded-lg">Active</span>
                 </div>
                 <h3 className="text-2xl font-bold text-gray-900">{cases.length}</h3>
                 <p className="text-sm text-gray-500">Active Cases</p>
               </div>
               <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                 <div className="flex items-center justify-between mb-4">
                   <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                     <FileText className="w-6 h-6 text-purple-600" />
                   </div>
                   <span className="text-xs font-semibold px-2 py-1 bg-purple-50 text-purple-600 rounded-lg">Pending</span>
                 </div>
                 <h3 className="text-2xl font-bold text-gray-900">{documents.length}</h3>
                 <p className="text-sm text-gray-500">Documents Pending</p>
               </div>
               <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                 <div className="flex items-center justify-between mb-4">
                   <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                     <Clock className="w-6 h-6 text-orange-600" />
                   </div>
                   <span className="text-xs font-semibold px-2 py-1 bg-orange-50 text-orange-600 rounded-lg">Upcoming</span>
                 </div>
                 <h3 className="text-2xl font-bold text-gray-900">{bookings.length}</h3>
                 <p className="text-sm text-gray-500">Next Hearing</p>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Upcoming Events */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Upcoming Consultations</h2>
                </div>
                {bookings.filter(b => b.status !== 'cancelled').length > 0 ? (
                  bookings.filter(b => b.status !== 'cancelled').map((booking, idx) => (
                   <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900">{booking.lawyer_name || 'Lawyer'}</h4>
                        <p className="text-sm text-gray-500">{new Date(booking.date).toLocaleDateString()} at {booking.time}</p>
                      </div>
                      {booking.meet_link && (
                         <a href={booking.meet_link} target="_blank" rel="noopener noreferrer">
                           <Button className="bg-blue-600 hover:bg-blue-700 text-white">Join Meet</Button>
                         </a>
                      )}
                   </div>
                  ))
                ) : (
                  <div className="bg-white p-8 rounded-xl border border-gray-100 text-center text-gray-500">
                    No upcoming consultations
                  </div>
                )}
              </div>

              {/* Recommended Lawyers */}
              <div>
                 <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended Lawyers</h2>
                 <div className="space-y-4">
                   {lawyers.slice(0, 3).map((lawyer, idx) => (
                      <LawyerCard key={idx} {...lawyer} onBook={() => {}} />
                   ))}
                 </div>
              </div>
            </div>"""

with open(file_path, 'r') as f:
    content = f.read()
    lines = content.split('\n')

# Helper function to find and replace grid in a section
def replace_in_section(section_keyword, new_content, label):
    global content, lines
    idx = content.find(section_keyword)
    if idx == -1:
        print(f"[{label}] Section keyword not found: {section_keyword}")
        return False
    
    # Search for grid AFTER the section keyword
    search_str = '<div className="grid grid-cols-1 lg:grid-cols-3'
    grid_idx = content.find(search_str, idx)
    
    if grid_idx == -1:
         print(f"[{label}] Grid not found after keyword.")
         return False

    # Find start line
    start_line = -1
    chars = 0
    for i, line in enumerate(lines):
        if chars + len(line) + 1 > grid_idx:
             start_line = i
             break
        chars += len(line) + 1
    
    if start_line != -1:
        # Verify it's the grid line (fuzzy check incase of char count drift)
        if search_str not in lines[start_line]:
             # Check next line or so
             if start_line+1 < len(lines) and search_str in lines[start_line+1]:
                 start_line += 1
        
        # Find end line (closing div with 14 spaces)
        end_line = -1
        for i in range(start_line + 1, len(lines)):
             if lines[i].strip() == '</div>' and lines[i].count(' ') == 14:
                  end_line = i
                  break
        
        if end_line != -1:
             print(f"[{label}] Replacing content at lines {start_line+1}-{end_line+1}")
             new_lines_list = new_content.split('\n')
             lines[start_line:end_line+1] = new_lines_list
             content = '\n'.join(lines) # Update content for next pass
             return True
        else:
             print(f"[{label}] Could not find end of block.")
             return False
    return False

# 1. Fix Dashboard Tab
replace_in_section("activeTab === 'dashboard' &&", dashboard_ui, "Dashboard")

# 2. Update Messages Tab
replace_in_section("activeTab === 'messages' &&", interactive_messaging_ui, "Messages")

with open(file_path, 'w') as f:
    f.write(content)
print("Script finished.")
