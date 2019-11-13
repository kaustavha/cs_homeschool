
tell application "Mail"
	set newMessage to make new outgoing message with properties {visible:true} 
	tell newMessage
		make new to recipient at newMessage with properties {address:"hi@kaustav.me"}
		set content to "Hi,

I saw your post on HN Who's Hiring. Are you still interviewing for any full time software engineering or related roles?  
I'm a generalist software engineer with 6 years of experience overall. Including startups and large enterprise companies. 
I have previous experience with web and saw them in your post.
 
I've been in the blockchain space since 2013 and received a full scholarship to attend Devcon in 2018 from the Ethereum Foundation. 
I've also helped organize and run workshops at ethereum developer meetups at UWaterloo and worked on hyperledger projects and patents within IBM. 
 
I'm a big proponent of open source with commits merged into 10+ projects including Pythons pip & FBs HHVM PHP compiler

You can find my resume at http://cv.kaustav.me or via my website: http://kaustav.me
LinkedIn: khaldar | https://www.linkedin.com/in/khaldar
Github: kaustavha | https://github.com/kaustavha

I'm currently based out of Toronto, Canada. But open to relocation or remote. 
Do you think I'd be a good fit for any open roles you have? 

Thank you, 
Kaustav Haldar 
"
		set subject to "SE opportunities[HN Who's Hiring 1/2019]"
		set sender to "kaustav haldar <hi@kaustav.me>"
	end tell
	send newMessage
end tell