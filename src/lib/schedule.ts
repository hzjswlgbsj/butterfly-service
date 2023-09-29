import schedule from "node-schedule";
import { nanoid } from "nanoid";

interface ScheduledTask {
  id?: string; // 任务的唯一标识
  roomId: string; // 文档房间号
  clientId?: string; // 客户端标识
  userInfo: UserInfo; // 用户信息
  intervalInMinutes: number; // 时间间隔（以分钟为单位）
  task: () => void; // 任务函数
  job?: schedule.Job | null; // 任务的 node-schedule Job 对象
}

interface UserInfo {
  userId: string;
  userName: string;
  // 其他用户信息字段
}

class Scheduler {
  private tasks: ScheduledTask[] = [];

  // 添加定时任务
  public addTask(taskConfig: ScheduledTask) {
    const job = schedule.scheduleJob(
      `*/${taskConfig.intervalInMinutes} * * * *`,
      () => {
        taskConfig.task(); // 执行任务函数
      }
    );

    const scheduledTask: ScheduledTask = {
      id: nanoid(16),
      roomId: taskConfig.roomId,
      clientId: taskConfig.clientId,
      userInfo: taskConfig.userInfo,
      intervalInMinutes: taskConfig.intervalInMinutes,
      task: taskConfig.task,
      job: job,
    };

    this.tasks.push(scheduledTask);
  }

  // 删除定时任务
  public removeTask(taskId: string) {
    const index = this.tasks.findIndex((task) => task.id === taskId);
    if (index !== -1) {
      const task = this.tasks[index];
      if (task.job) {
        task.job.cancel(); // 取消任务
      }
      this.tasks.splice(index, 1); // 从任务列表中移除
    }
  }

  // 执行所有任务
  public runAllTasks() {
    this.tasks.forEach((task) => task.job?.invoke());
  }

  // 关闭所有任务
  public cancelAllTasks() {
    this.tasks.forEach((task) => {
      if (task.job) {
        task.job.cancel();
      }
    });
    this.tasks = [];
  }
}

export default Scheduler;
