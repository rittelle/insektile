FROM kdeneon/plasma
USER root
RUN apt-get install -y kdebugsettings entr
# Disable the screen locker
RUN mkdir -p /home/neon/.config
ADD kscreenlockerrc /home/neon/.config
RUN chown -R neon:neon /home/neon/.config/
# Enable logging for KWin Scripting
RUN mkdir -p /home/neon/.config/QtProject/
ADD qtlogging.ini /home/neon/.config/QtProject/
RUN chown -R neon:neon /home/neon/.config/QtProject/
# Run the auto updating script on startup
RUN mkdir -p /home/neon/.config/autostart/
ADD auto_update_script.sh /home/neon/
ADD auto_update_script.desktop /home/neon/.config/autostart/
RUN chown -R neon:neon /home/neon/.config/autostart/

USER neon
