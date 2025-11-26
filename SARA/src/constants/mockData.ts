import { User } from '../types';

export const mockUserData: User = {
  nationalId: '1234567890',
  name: 'أحمد محمد العتيبي',
  nameEn: 'Ahmed Mohammed Al-Otaibi',
  birthDate: '1990-05-15',
  nationality: 'سعودي',
  city: 'الرياض',
  phone: '0551234567',
  services: [
    {
      id: 1,
      nameAr: 'تجديد الهوية الوطنية',
      nameEn: 'National ID Renewal',
      status: 'نشط',
      expiryDate: '2026-03-20',
      icon: 'badge'
    },
    {
      id: 2,
      nameAr: 'رخصة القيادة',
      nameEn: 'Driving License',
      status: 'منتهية',
      expiryDate: '2024-08-10',
      icon: 'car'
    },
    {
      id: 3,
      nameAr: 'جواز السفر',
      nameEn: 'Passport',
      status: 'نشط',
      expiryDate: '2027-12-05',
      icon: 'passport'
    }
  ],
  notifications: [
    {
      id: 1,
      titleAr: 'تنبيه: موعد تجديد الرخصة',
      messageAr: 'رخصة القيادة الخاصة بك انتهت صلاحيتها',
      date: '2025-11-20'
    }
  ]
};
