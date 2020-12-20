# MACOSX Launcher for the XP Visualiser program

osascript <<END
tell application "Terminal"
    do script "cd \"`pwd`\";java -jar ./back-end.jar;"
end tell
END

sleep 7

# Frontend launch

open -a 'Safari' ../front-end/stickyNoteBoard/login.html
 

