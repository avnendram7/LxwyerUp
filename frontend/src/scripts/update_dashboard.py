
import os

file_path = '/Users/avnendramishra/Desktop/Lxwyer Up Tech/NyaaySathi/frontend/src/pages/UserDashboard.js'

new_content = """              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
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

with open(file_path, 'r') as f:
    content = f.read()

start_marker = '<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">'
end_marker = '            </div>' # This is tricky as there are many closing divs.

# Let's find the start marker
start_idx = content.find(start_marker)
if start_idx == -1:
    print("Start marker not found")
    exit(1)

# Find the end of this div block. It closes the Messages Tab content before the loop closes?
# In the original file:
# 876: <div className="grid ...
# ...
# 989: </div>
# 990: </div> (Closes the p-8 div?)

# I'll rely on the indentation or counting braces if I wrote a parser, but here I'll try to find the next occurrence of the closing tag sequence that matches the indentation level.
# Actually, I'll just replace everything from start_marker until the end of the file minus the last few lines (which are closing tags).
# But that's risky.

# Let's use the content I tried to replace as the "Old Content" to be replaced.
# I'll construct the old content regex or string matching.
# Since exact match failed, I'll use a slightly fuzzy approach or just find the start and look for the specific closing tag I know exists.

# Finding the end index:
# The `replace_file_content` failed because of mismatch.
# I will search for the specific unique string that ends the chat window in the OLD version.
# Old version had: `<p className="text-xs text-gray-500 mt-1">09:20 AM</p>` then some divs...
# The last part of the old content was:
# ```
#                   </div>
#                 </div>
#               </div>
#             </div>
# ```
# (Line 988-990)

# I will find `start_idx`.
# Then I will look for the line `          activeTab === 'messages' && (` (Line 858).
# The content I want to replace is INSIDE this block.
# I'll replace the inner `div` of `activeTab === 'messages'`.

# Let's just use the start marker and assume it goes until the line before `          )` which closes the expression?
# No, `)` is line 991 (implied).

# Let's try to identify the block by start and end lines roughly.
lines = content.split('\n')
start_line_idx = -1
for i, line in enumerate(lines):
    if 'grid grid-cols-1 lg:grid-cols-3 gap-6' in line:
        start_line_idx = i
        break

if start_line_idx == -1:
    print("Start line not found")
    exit(1)

# End line is where the indentation returns to the parent level?
# Start line indentation is 14 spaces.
# I'll look for the next line with 14 spaces `              </div>` that closes this grid.
end_line_idx = -1
for i in range(start_line_idx + 1, len(lines)):
    if lines[i].startswith('              </div>'):
        end_line_idx = i
        break

if end_line_idx == -1:
    print("End line not found")
    # identifying by content
    # Look for the last input field closing div
    for i in range(start_line_idx + 1, len(lines)):
         if 'placeholder="Type your message..."' in lines[i]:
             # The closing divs follow shortly
             end_line_idx = i + 15 # approximate
             break

# Actually, the python script can just use strict string replacement if I copy the OLD content exactly from the file view.
# I'll copy the old content from the `view_file` output (Lines 876-989) into a variable here.
old_content_snippet = """<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">"""
# validating it exists
if old_content_snippet not in content:
     print("Old content snippet not found")
     exit(1)

# I will replace from `start_line_idx` to `end_line_idx`.
# I'll re-scan for `              </div>` (14 spaces) starting from start_line_idx.
for i in range(start_line_idx + 1, len(lines)):
   if lines[i] == '              </div>':
       end_line_idx = i
       break

if end_line_idx != -1:
    print(f"Replacing lines {start_line_idx+1} to {end_line_idx+1}")
    new_lines = new_content.split('\n')
    lines[start_line_idx:end_line_idx+1] = new_lines
    final_content = '\n'.join(lines)
    with open(file_path, 'w') as f:
        f.write(final_content)
    print("Successfully updated")
else:
    print("Could not find closing tag")
