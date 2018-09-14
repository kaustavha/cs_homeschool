
tell application "Microsoft Outlook"
 set theContent to "<p style='white-space:pre;display:block;overflow-wrap:normal;'>Hi,

I came across your post on Hacker News and wanted to inquire if you were still interviewing for any FT SE roles.
I have experience with go, python, javascript, aws and noticed them in the post.
I’ve been following blockchain projects like ethereum, dash, ripple, bitcoin etc for a while and have read many whitepapers. I worked on a prototype ethereum ui before mist. More recently I won a prize at Ethwaterloo for prototyping an identity management / social network layer protocol for ethereum. I've also helped organize and run workshops at a ethereum developer meetup and worked on hyperledger projects within IBM
Here's my resume: <a href='http://kaustavha.github.io/kaustav-haldar-resume/'>bit.ly/khaldarcv</a> 
          LinkedIn: <a href='https://www.linkedin.com/in/khaldar'>khaldar</a> 
          Github: <a href='https://github.com/kaustavha'>kaustavha</a> 

Please reach out if you think I'd be a good fit for anything you're looking for. 
Looking forward to hearing back from you.

Thanks, 
Kaustav Haldar 
</p>"
   set newMessage to make new outgoing message with properties {subject:"HackerNews FT SE opportunities", content:theContent} 
   make new to recipient at newMessage with properties {email address: {address:"slyfox@numer.ai"}}
   send message id (id of newMessage)
end tell
 delay 504 

tell application "Microsoft Outlook"
 set theContent to "<p style='white-space:pre;display:block;overflow-wrap:normal;'>Hi,

I came across your post on Hacker News and wanted to inquire if you were still interviewing for any FT SE roles.
Here's my resume: <a href='http://kaustavha.github.io/kaustav-haldar-resume/'>bit.ly/khaldarcv</a> 
          LinkedIn: <a href='https://www.linkedin.com/in/khaldar'>khaldar</a> 
          Github: <a href='https://github.com/kaustavha'>kaustavha</a> 

Please reach out if you think I'd be a good fit for anything you're looking for. 
Looking forward to hearing back from you.

Thanks, 
Kaustav Haldar 
</p>"
   set newMessage to make new outgoing message with properties {subject:"HackerNews FT SE opportunities", content:theContent} 
   make new to recipient at newMessage with properties {email address: {address:"hnjobs@yorzegroup.com"}}
   send message id (id of newMessage)
end tell
 delay 502 
