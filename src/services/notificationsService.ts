import { NotificationModel } from '../types/database';

export const INITIAL_NOTIFICATIONS: NotificationModel[] = [
  {
    id: 'notif_1',
    userId: 'usr_student',
    title: '¡Bienvenido a YOVE Academy 2.0!',
    message: 'Tu cuenta ha sido activada con nivel Técnico Diagnosta y +2,850 XP iniciales.',
    type: 'system',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'notif_2',
    userId: 'usr_student',
    title: 'Nuevo Certificado Disponible',
    message: 'Has completado el Módulo de Redes CAN Bus y tu certificado "YOVE-2026-8849" ya está listo para descargar.',
    type: 'certificate',
    isRead: false,
    linkUrl: 'certificados',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'notif_3',
    userId: 'usr_student',
    title: 'Nueva Respuesta en el Foro',
    message: 'El Prof. Mario Rossi ha respondido a tu consulta técnica sobre el código P0171 en Toyota Yaris.',
    type: 'community',
    isRead: true,
    linkUrl: 'comunidad',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

export class NotificationsService {
  private static notifications: NotificationModel[] = [...INITIAL_NOTIFICATIONS];

  public static getNotifications(): NotificationModel[] {
    return this.notifications;
  }

  public static getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  public static markAsRead(id: string) {
    this.notifications = this.notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
  }

  public static markAllAsRead() {
    this.notifications = this.notifications.map(n => ({ ...n, isRead: true }));
  }

  public static addNotification(notif: Omit<NotificationModel, 'id' | 'createdAt' | 'isRead'>) {
    const newNotif: NotificationModel = {
      ...notif,
      id: `notif_${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    this.notifications.unshift(newNotif);
  }
}
