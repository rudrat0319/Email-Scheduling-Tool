export class SchedulingEngine {
  computeSchedule(startTime: Date, delaySeconds: number, hourlyLimit: number, recipientCount: number): Date[] {
    const times: Date[] = [];
    const secondsBetweenEmails = Math.max(delaySeconds, 3600 / hourlyLimit);
    
    for (let i = 0; i < recipientCount; i++) {
      const offsetSeconds = i * secondsBetweenEmails;
      const scheduledTime = new Date(startTime.getTime() + offsetSeconds * 1000);
      times.push(scheduledTime);
    }
    
    return times;
  }
}