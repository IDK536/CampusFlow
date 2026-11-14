import type { Booking, BookingStatus, Room, User } from './types'
import { addDaysISO, todayISO } from '../data/timeGrid'

/** Seed из раздела 5 раздаточного материала с расширенной базой: 20 корпусов (A-T), 2000 аудиторий, 60 пользователей. Занято ровно 85% аудиторий (850 из 1000) в первых 10 корпусах (A-J). Пароль = логин. */
export const SEED_USERS: User[] = [
  {
    "id": 1,
    "login": "student1",
    "displayName": "Иван Студентов",
    "role": "student"
  },
  {
    "id": 2,
    "login": "student2",
    "displayName": "Мария Студентова",
    "role": "student"
  },
  {
    "id": 3,
    "login": "admin",
    "displayName": "Администратор Пупкин",
    "role": "admin"
  },
  {
    "id": 4,
    "login": "student3",
    "displayName": "Алексей Смирнов",
    "role": "student"
  },
  {
    "id": 5,
    "login": "student4",
    "displayName": "Екатерина Кузнецова",
    "role": "student"
  },
  {
    "id": 6,
    "login": "student5",
    "displayName": "Дмитрий Соколов",
    "role": "student"
  },
  {
    "id": 7,
    "login": "student6",
    "displayName": "Анастасия Попова",
    "role": "student"
  },
  {
    "id": 8,
    "login": "student7",
    "displayName": "Михаил Лебедев",
    "role": "student"
  },
  {
    "id": 9,
    "login": "student8",
    "displayName": "Полина Козлова",
    "role": "student"
  },
  {
    "id": 10,
    "login": "student9",
    "displayName": "Сергей Новиков",
    "role": "student"
  },
  {
    "id": 11,
    "login": "student10",
    "displayName": "Ксения Морозова",
    "role": "student"
  },
  {
    "id": 12,
    "login": "student11",
    "displayName": "Артём Петров",
    "role": "student"
  },
  {
    "id": 13,
    "login": "student12",
    "displayName": "Вероника Волкова",
    "role": "student"
  },
  {
    "id": 14,
    "login": "student13",
    "displayName": "Илья Соловьёв",
    "role": "student"
  },
  {
    "id": 15,
    "login": "student14",
    "displayName": "Алина Васильева",
    "role": "student"
  },
  {
    "id": 16,
    "login": "student15",
    "displayName": "Кирилл Зайцев",
    "role": "student"
  },
  {
    "id": 17,
    "login": "student16",
    "displayName": "Дарья Павлова",
    "role": "student"
  },
  {
    "id": 18,
    "login": "student17",
    "displayName": "Максим Семёнов",
    "role": "student"
  },
  {
    "id": 19,
    "login": "student18",
    "displayName": "Валерия Голубева",
    "role": "student"
  },
  {
    "id": 20,
    "login": "student19",
    "displayName": "Егор Виноградов",
    "role": "student"
  },
  {
    "id": 21,
    "login": "student20",
    "displayName": "Виктория Богданова",
    "role": "student"
  },
  {
    "id": 22,
    "login": "student21",
    "displayName": "Даниил Воробьёв",
    "role": "student"
  },
  {
    "id": 23,
    "login": "student22",
    "displayName": "Алёна Фёдорова",
    "role": "student"
  },
  {
    "id": 24,
    "login": "student23",
    "displayName": "Никита Михайлов",
    "role": "student"
  },
  {
    "id": 25,
    "login": "student24",
    "displayName": "Татьяна Беляева",
    "role": "student"
  },
  {
    "id": 26,
    "login": "student25",
    "displayName": "Андрей Тарасов",
    "role": "student"
  },
  {
    "id": 27,
    "login": "student26",
    "displayName": "Евгений Романов",
    "role": "student"
  },
  {
    "id": 28,
    "login": "student27",
    "displayName": "Марина Крылова",
    "role": "student"
  },
  {
    "id": 29,
    "login": "student28",
    "displayName": "Тимофей Орлов",
    "role": "student"
  },
  {
    "id": 30,
    "login": "student29",
    "displayName": "Светлана Макарова",
    "role": "student"
  },
  {
    "id": 31,
    "login": "starosta_pi201",
    "displayName": "Роман Ковалёв (Староста ПИ-201)",
    "role": "student"
  },
  {
    "id": 32,
    "login": "starosta_pm301",
    "displayName": "София Ильина (Староста ПМ-301)",
    "role": "student"
  },
  {
    "id": 33,
    "login": "starosta_ib102",
    "displayName": "Владислав Гусев (Староста ИБ-102)",
    "role": "student"
  },
  {
    "id": 34,
    "login": "starosta_fit401",
    "displayName": "Юлия Титова (Староста ФИТ-401)",
    "role": "student"
  },
  {
    "id": 35,
    "login": "starosta_ivt103",
    "displayName": "Богдан Марков (Староста ИВТ-103)",
    "role": "student"
  },
  {
    "id": 36,
    "login": "starosta_ai202",
    "displayName": "Камилла Сафина (Староста ИИ-202)",
    "role": "student"
  },
  {
    "id": 37,
    "login": "starosta_kb301",
    "displayName": "Арсений Беляев (Староста КБ-301)",
    "role": "student"
  },
  {
    "id": 38,
    "login": "stud_council",
    "displayName": "Глеб Кудрявцев (Председатель Студсовета)",
    "role": "student"
  },
  {
    "id": 39,
    "login": "sciclub_lead",
    "displayName": "Ярослав Баранов (СНО ФИСТ)",
    "role": "student"
  },
  {
    "id": 40,
    "login": "sportclub_lead",
    "displayName": "Матвей Куликов (Спортклуб Чемпион)",
    "role": "student"
  },
  {
    "id": 41,
    "login": "mediacenter",
    "displayName": "Елизавета Алексеева (СтудМедиа)",
    "role": "student"
  },
  {
    "id": 42,
    "login": "hack_captain",
    "displayName": "Тимур Каримов (Капитан Хакатон-сборной)",
    "role": "student"
  },
  {
    "id": 43,
    "login": "tutor_firstyear",
    "displayName": "Антон Мельников (Куратор первокурсников)",
    "role": "student"
  },
  {
    "id": 44,
    "login": "tutor_senior",
    "displayName": "Олеся Медведева (Тьюторская служба)",
    "role": "student"
  },
  {
    "id": 45,
    "login": "robotics_lead",
    "displayName": "Марк Щербаков (Робототехнический клуб)",
    "role": "student"
  },
  {
    "id": 46,
    "login": "gamedev_lead",
    "displayName": "Денис Красильников (GameDev сообщество)",
    "role": "student"
  },
  {
    "id": 47,
    "login": "ai_community",
    "displayName": "Кристина Гордеева (AI & ML Lab)",
    "role": "student"
  },
  {
    "id": 48,
    "login": "cyber_lead",
    "displayName": "Артур Хакимов (Киберспортивная лига)",
    "role": "student"
  },
  {
    "id": 49,
    "login": "admin_dekanat",
    "displayName": "Ольга Викторовна Смирнова (Деканат)",
    "role": "admin"
  },
  {
    "id": 50,
    "login": "admin_dispatcher",
    "displayName": "Галина Васильевна Кравцова (Диспетчер расписания)",
    "role": "admin"
  },
  {
    "id": 51,
    "login": "admin_it_head",
    "displayName": "Алексей Борисович Сисадминов (IT-отдел)",
    "role": "admin"
  },
  {
    "id": 52,
    "login": "admin_security",
    "displayName": "Виктор Сергеевич Охранов (Комендатура)",
    "role": "admin"
  },
  {
    "id": 53,
    "login": "admin_library",
    "displayName": "Наталья Ивановна Книжная (Библиотечный центр)",
    "role": "admin"
  },
  {
    "id": 54,
    "login": "admin_dept_pi",
    "displayName": "Проф. Виктор Николаевич Дроздов (Зав. каф. ПИ)",
    "role": "admin"
  },
  {
    "id": 55,
    "login": "admin_dept_ai",
    "displayName": "Доц. Елена Сергеевна Романова (Кафедра ИИ)",
    "role": "admin"
  },
  {
    "id": 56,
    "login": "admin_dept_math",
    "displayName": "Проф. Аркадий Львович Кац (Кафедра высшей математики)",
    "role": "admin"
  },
  {
    "id": 57,
    "login": "admin_lab_hardware",
    "displayName": "Инж. Михаил Юрьевич Паяльников (Лаборатория схемотехники)",
    "role": "admin"
  },
  {
    "id": 58,
    "login": "admin_multimedia",
    "displayName": "Тех. специалист Игорь Селезнёв (Мультимедиа-центр)",
    "role": "admin"
  },
  {
    "id": 59,
    "login": "admin_coop",
    "displayName": "Марина Александровна Ветрова (Отдел практики и карьеры)",
    "role": "admin"
  },
  {
    "id": 60,
    "login": "admin_rectorat",
    "displayName": "Проректор Сергей Анатольевич Воронов",
    "role": "admin"
  }
]

// 2000 аудиторий: без контекстного типа, иначе TS не справляется с проверкой литерала (TS2590).
export const SEED_ROOMS = [
  {
    "id": 1,
    "name": "A-101",
    "building": "A",
    "floor": 1,
    "capacity": 30,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 2,
    "name": "A-102",
    "building": "A",
    "floor": 1,
    "capacity": 20,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 3,
    "name": "A-203",
    "building": "A",
    "floor": 2,
    "capacity": 15,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 4,
    "name": "B-101",
    "building": "B",
    "floor": 1,
    "capacity": 40,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 5,
    "name": "B-204",
    "building": "B",
    "floor": 2,
    "capacity": 25,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 6,
    "name": "B-305",
    "building": "B",
    "floor": 3,
    "capacity": 10,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 7,
    "name": "C-110",
    "building": "C",
    "floor": 1,
    "capacity": 50,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 8,
    "name": "C-210",
    "building": "C",
    "floor": 2,
    "capacity": 35,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 9,
    "name": "C-301",
    "building": "C",
    "floor": 3,
    "capacity": 12,
    "equipment": [
      "whiteboard",
      "projector"
    ]
  },
  {
    "id": 10,
    "name": "D-101",
    "building": "D",
    "floor": 1,
    "capacity": 60,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 11,
    "name": "D-202",
    "building": "D",
    "floor": 2,
    "capacity": 18,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 12,
    "name": "D-303",
    "building": "D",
    "floor": 3,
    "capacity": 24,
    "equipment": [
      "projector",
      "computers"
    ]
  },
  {
    "id": 13,
    "name": "A-103",
    "building": "A",
    "floor": 1,
    "capacity": 100,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 14,
    "name": "A-104",
    "building": "A",
    "floor": 1,
    "capacity": 20,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 15,
    "name": "A-105",
    "building": "A",
    "floor": 1,
    "capacity": 45,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 16,
    "name": "A-106",
    "building": "A",
    "floor": 1,
    "capacity": 120,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 17,
    "name": "A-107",
    "building": "A",
    "floor": 1,
    "capacity": 24,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 18,
    "name": "A-108",
    "building": "A",
    "floor": 1,
    "capacity": 50,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 19,
    "name": "A-109",
    "building": "A",
    "floor": 1,
    "capacity": 150,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 20,
    "name": "A-110",
    "building": "A",
    "floor": 1,
    "capacity": 25,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 21,
    "name": "A-111",
    "building": "A",
    "floor": 1,
    "capacity": 60,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 22,
    "name": "A-112",
    "building": "A",
    "floor": 1,
    "capacity": 12,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 23,
    "name": "A-113",
    "building": "A",
    "floor": 1,
    "capacity": 30,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 24,
    "name": "A-114",
    "building": "A",
    "floor": 1,
    "capacity": 75,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 25,
    "name": "A-115",
    "building": "A",
    "floor": 1,
    "capacity": 15,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 26,
    "name": "A-116",
    "building": "A",
    "floor": 1,
    "capacity": 35,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 27,
    "name": "A-117",
    "building": "A",
    "floor": 1,
    "capacity": 80,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 28,
    "name": "A-118",
    "building": "A",
    "floor": 1,
    "capacity": 18,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 29,
    "name": "A-119",
    "building": "A",
    "floor": 1,
    "capacity": 40,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 30,
    "name": "A-120",
    "building": "A",
    "floor": 1,
    "capacity": 100,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 31,
    "name": "A-121",
    "building": "A",
    "floor": 1,
    "capacity": 20,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 32,
    "name": "A-122",
    "building": "A",
    "floor": 1,
    "capacity": 45,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 33,
    "name": "A-123",
    "building": "A",
    "floor": 1,
    "capacity": 120,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 34,
    "name": "A-124",
    "building": "A",
    "floor": 1,
    "capacity": 24,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 35,
    "name": "A-125",
    "building": "A",
    "floor": 1,
    "capacity": 50,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 36,
    "name": "A-201",
    "building": "A",
    "floor": 2,
    "capacity": 18,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 37,
    "name": "A-202",
    "building": "A",
    "floor": 2,
    "capacity": 40,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 38,
    "name": "A-204",
    "building": "A",
    "floor": 2,
    "capacity": 20,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 39,
    "name": "A-205",
    "building": "A",
    "floor": 2,
    "capacity": 45,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 40,
    "name": "A-206",
    "building": "A",
    "floor": 2,
    "capacity": 120,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 41,
    "name": "A-207",
    "building": "A",
    "floor": 2,
    "capacity": 24,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 42,
    "name": "A-208",
    "building": "A",
    "floor": 2,
    "capacity": 50,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 43,
    "name": "A-209",
    "building": "A",
    "floor": 2,
    "capacity": 150,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 44,
    "name": "A-210",
    "building": "A",
    "floor": 2,
    "capacity": 25,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 45,
    "name": "A-211",
    "building": "A",
    "floor": 2,
    "capacity": 60,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 46,
    "name": "A-212",
    "building": "A",
    "floor": 2,
    "capacity": 12,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 47,
    "name": "A-213",
    "building": "A",
    "floor": 2,
    "capacity": 30,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 48,
    "name": "A-214",
    "building": "A",
    "floor": 2,
    "capacity": 75,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 49,
    "name": "A-215",
    "building": "A",
    "floor": 2,
    "capacity": 15,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 50,
    "name": "A-216",
    "building": "A",
    "floor": 2,
    "capacity": 35,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 51,
    "name": "A-217",
    "building": "A",
    "floor": 2,
    "capacity": 80,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 52,
    "name": "A-218",
    "building": "A",
    "floor": 2,
    "capacity": 18,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 53,
    "name": "A-219",
    "building": "A",
    "floor": 2,
    "capacity": 40,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 54,
    "name": "A-220",
    "building": "A",
    "floor": 2,
    "capacity": 100,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 55,
    "name": "A-221",
    "building": "A",
    "floor": 2,
    "capacity": 20,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 56,
    "name": "A-222",
    "building": "A",
    "floor": 2,
    "capacity": 45,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 57,
    "name": "A-223",
    "building": "A",
    "floor": 2,
    "capacity": 120,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 58,
    "name": "A-224",
    "building": "A",
    "floor": 2,
    "capacity": 24,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 59,
    "name": "A-225",
    "building": "A",
    "floor": 2,
    "capacity": 50,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 60,
    "name": "A-301",
    "building": "A",
    "floor": 3,
    "capacity": 18,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 61,
    "name": "A-302",
    "building": "A",
    "floor": 3,
    "capacity": 40,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 62,
    "name": "A-303",
    "building": "A",
    "floor": 3,
    "capacity": 100,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 63,
    "name": "A-304",
    "building": "A",
    "floor": 3,
    "capacity": 20,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 64,
    "name": "A-305",
    "building": "A",
    "floor": 3,
    "capacity": 45,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 65,
    "name": "A-306",
    "building": "A",
    "floor": 3,
    "capacity": 120,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 66,
    "name": "A-307",
    "building": "A",
    "floor": 3,
    "capacity": 24,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 67,
    "name": "A-308",
    "building": "A",
    "floor": 3,
    "capacity": 50,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 68,
    "name": "A-309",
    "building": "A",
    "floor": 3,
    "capacity": 150,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 69,
    "name": "A-310",
    "building": "A",
    "floor": 3,
    "capacity": 25,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 70,
    "name": "A-311",
    "building": "A",
    "floor": 3,
    "capacity": 60,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 71,
    "name": "A-312",
    "building": "A",
    "floor": 3,
    "capacity": 12,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 72,
    "name": "A-313",
    "building": "A",
    "floor": 3,
    "capacity": 30,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 73,
    "name": "A-314",
    "building": "A",
    "floor": 3,
    "capacity": 75,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 74,
    "name": "A-315",
    "building": "A",
    "floor": 3,
    "capacity": 15,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 75,
    "name": "A-316",
    "building": "A",
    "floor": 3,
    "capacity": 35,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 76,
    "name": "A-317",
    "building": "A",
    "floor": 3,
    "capacity": 80,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 77,
    "name": "A-318",
    "building": "A",
    "floor": 3,
    "capacity": 18,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 78,
    "name": "A-319",
    "building": "A",
    "floor": 3,
    "capacity": 40,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 79,
    "name": "A-320",
    "building": "A",
    "floor": 3,
    "capacity": 100,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 80,
    "name": "A-321",
    "building": "A",
    "floor": 3,
    "capacity": 20,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 81,
    "name": "A-322",
    "building": "A",
    "floor": 3,
    "capacity": 45,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 82,
    "name": "A-323",
    "building": "A",
    "floor": 3,
    "capacity": 120,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 83,
    "name": "A-324",
    "building": "A",
    "floor": 3,
    "capacity": 24,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 84,
    "name": "A-325",
    "building": "A",
    "floor": 3,
    "capacity": 50,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 85,
    "name": "A-401",
    "building": "A",
    "floor": 4,
    "capacity": 18,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 86,
    "name": "A-402",
    "building": "A",
    "floor": 4,
    "capacity": 40,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 87,
    "name": "A-403",
    "building": "A",
    "floor": 4,
    "capacity": 100,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 88,
    "name": "A-404",
    "building": "A",
    "floor": 4,
    "capacity": 20,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 89,
    "name": "A-405",
    "building": "A",
    "floor": 4,
    "capacity": 45,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 90,
    "name": "A-406",
    "building": "A",
    "floor": 4,
    "capacity": 120,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 91,
    "name": "A-407",
    "building": "A",
    "floor": 4,
    "capacity": 24,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 92,
    "name": "A-408",
    "building": "A",
    "floor": 4,
    "capacity": 50,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 93,
    "name": "A-409",
    "building": "A",
    "floor": 4,
    "capacity": 150,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 94,
    "name": "A-410",
    "building": "A",
    "floor": 4,
    "capacity": 25,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 95,
    "name": "A-411",
    "building": "A",
    "floor": 4,
    "capacity": 60,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 96,
    "name": "A-412",
    "building": "A",
    "floor": 4,
    "capacity": 12,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 97,
    "name": "A-413",
    "building": "A",
    "floor": 4,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 98,
    "name": "A-414",
    "building": "A",
    "floor": 4,
    "capacity": 75,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 99,
    "name": "A-415",
    "building": "A",
    "floor": 4,
    "capacity": 15,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 100,
    "name": "A-416",
    "building": "A",
    "floor": 4,
    "capacity": 35,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 101,
    "name": "A-417",
    "building": "A",
    "floor": 4,
    "capacity": 80,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 102,
    "name": "A-418",
    "building": "A",
    "floor": 4,
    "capacity": 18,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 103,
    "name": "A-419",
    "building": "A",
    "floor": 4,
    "capacity": 40,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 104,
    "name": "A-420",
    "building": "A",
    "floor": 4,
    "capacity": 100,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 105,
    "name": "A-421",
    "building": "A",
    "floor": 4,
    "capacity": 20,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 106,
    "name": "A-422",
    "building": "A",
    "floor": 4,
    "capacity": 45,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 107,
    "name": "A-423",
    "building": "A",
    "floor": 4,
    "capacity": 120,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 108,
    "name": "A-424",
    "building": "A",
    "floor": 4,
    "capacity": 24,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 109,
    "name": "A-425",
    "building": "A",
    "floor": 4,
    "capacity": 50,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 110,
    "name": "B-102",
    "building": "B",
    "floor": 1,
    "capacity": 120,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 111,
    "name": "B-103",
    "building": "B",
    "floor": 1,
    "capacity": 24,
    "equipment": [
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 112,
    "name": "B-104",
    "building": "B",
    "floor": 1,
    "capacity": 50,
    "equipment": [
      "computers",
      "audio"
    ]
  },
  {
    "id": 113,
    "name": "B-105",
    "building": "B",
    "floor": 1,
    "capacity": 150,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 114,
    "name": "B-106",
    "building": "B",
    "floor": 1,
    "capacity": 25,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 115,
    "name": "B-107",
    "building": "B",
    "floor": 1,
    "capacity": 60,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 116,
    "name": "B-108",
    "building": "B",
    "floor": 1,
    "capacity": 12,
    "equipment": [
      "computers",
      "whiteboard",
      "projector"
    ]
  },
  {
    "id": 117,
    "name": "B-109",
    "building": "B",
    "floor": 1,
    "capacity": 30,
    "equipment": [
      "audio"
    ]
  },
  {
    "id": 118,
    "name": "B-110",
    "building": "B",
    "floor": 1,
    "capacity": 75,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 119,
    "name": "B-111",
    "building": "B",
    "floor": 1,
    "capacity": 15,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 120,
    "name": "B-112",
    "building": "B",
    "floor": 1,
    "capacity": 35,
    "equipment": [
      "audio",
      "video"
    ]
  },
  {
    "id": 121,
    "name": "B-113",
    "building": "B",
    "floor": 1,
    "capacity": 80,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 122,
    "name": "B-114",
    "building": "B",
    "floor": 1,
    "capacity": 18,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 123,
    "name": "B-115",
    "building": "B",
    "floor": 1,
    "capacity": 40,
    "equipment": [
      "computers",
      "audio"
    ]
  },
  {
    "id": 124,
    "name": "B-116",
    "building": "B",
    "floor": 1,
    "capacity": 100,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 125,
    "name": "B-117",
    "building": "B",
    "floor": 1,
    "capacity": 20,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 126,
    "name": "B-118",
    "building": "B",
    "floor": 1,
    "capacity": 45,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 127,
    "name": "B-119",
    "building": "B",
    "floor": 1,
    "capacity": 120,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 128,
    "name": "B-120",
    "building": "B",
    "floor": 1,
    "capacity": 24,
    "equipment": [
      "audio"
    ]
  },
  {
    "id": 129,
    "name": "B-121",
    "building": "B",
    "floor": 1,
    "capacity": 50,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 130,
    "name": "B-122",
    "building": "B",
    "floor": 1,
    "capacity": 150,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 131,
    "name": "B-123",
    "building": "B",
    "floor": 1,
    "capacity": 25,
    "equipment": [
      "audio",
      "video"
    ]
  },
  {
    "id": 132,
    "name": "B-124",
    "building": "B",
    "floor": 1,
    "capacity": 60,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 133,
    "name": "B-125",
    "building": "B",
    "floor": 1,
    "capacity": 12,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 134,
    "name": "B-201",
    "building": "B",
    "floor": 2,
    "capacity": 45,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 135,
    "name": "B-202",
    "building": "B",
    "floor": 2,
    "capacity": 120,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 136,
    "name": "B-203",
    "building": "B",
    "floor": 2,
    "capacity": 24,
    "equipment": [
      "audio"
    ]
  },
  {
    "id": 137,
    "name": "B-205",
    "building": "B",
    "floor": 2,
    "capacity": 150,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 138,
    "name": "B-206",
    "building": "B",
    "floor": 2,
    "capacity": 25,
    "equipment": [
      "audio",
      "video"
    ]
  },
  {
    "id": 139,
    "name": "B-207",
    "building": "B",
    "floor": 2,
    "capacity": 60,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 140,
    "name": "B-208",
    "building": "B",
    "floor": 2,
    "capacity": 12,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 141,
    "name": "B-209",
    "building": "B",
    "floor": 2,
    "capacity": 30,
    "equipment": [
      "computers",
      "audio"
    ]
  },
  {
    "id": 142,
    "name": "B-210",
    "building": "B",
    "floor": 2,
    "capacity": 75,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 143,
    "name": "B-211",
    "building": "B",
    "floor": 2,
    "capacity": 15,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 144,
    "name": "B-212",
    "building": "B",
    "floor": 2,
    "capacity": 35,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 145,
    "name": "B-213",
    "building": "B",
    "floor": 2,
    "capacity": 80,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 146,
    "name": "B-214",
    "building": "B",
    "floor": 2,
    "capacity": 18,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 147,
    "name": "B-215",
    "building": "B",
    "floor": 2,
    "capacity": 40,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 148,
    "name": "B-216",
    "building": "B",
    "floor": 2,
    "capacity": 100,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 149,
    "name": "B-217",
    "building": "B",
    "floor": 2,
    "capacity": 20,
    "equipment": [
      "audio",
      "video"
    ]
  },
  {
    "id": 150,
    "name": "B-218",
    "building": "B",
    "floor": 2,
    "capacity": 45,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 151,
    "name": "B-219",
    "building": "B",
    "floor": 2,
    "capacity": 120,
    "equipment": [
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 152,
    "name": "B-220",
    "building": "B",
    "floor": 2,
    "capacity": 24,
    "equipment": [
      "computers",
      "audio"
    ]
  },
  {
    "id": 153,
    "name": "B-221",
    "building": "B",
    "floor": 2,
    "capacity": 50,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 154,
    "name": "B-222",
    "building": "B",
    "floor": 2,
    "capacity": 150,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 155,
    "name": "B-223",
    "building": "B",
    "floor": 2,
    "capacity": 25,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 156,
    "name": "B-224",
    "building": "B",
    "floor": 2,
    "capacity": 60,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 157,
    "name": "B-225",
    "building": "B",
    "floor": 2,
    "capacity": 12,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 158,
    "name": "B-301",
    "building": "B",
    "floor": 3,
    "capacity": 45,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 159,
    "name": "B-302",
    "building": "B",
    "floor": 3,
    "capacity": 120,
    "equipment": [
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 160,
    "name": "B-303",
    "building": "B",
    "floor": 3,
    "capacity": 24,
    "equipment": [
      "computers",
      "audio"
    ]
  },
  {
    "id": 161,
    "name": "B-304",
    "building": "B",
    "floor": 3,
    "capacity": 50,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 162,
    "name": "B-306",
    "building": "B",
    "floor": 3,
    "capacity": 25,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 163,
    "name": "B-307",
    "building": "B",
    "floor": 3,
    "capacity": 60,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 164,
    "name": "B-308",
    "building": "B",
    "floor": 3,
    "capacity": 12,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 165,
    "name": "B-309",
    "building": "B",
    "floor": 3,
    "capacity": 30,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 166,
    "name": "B-310",
    "building": "B",
    "floor": 3,
    "capacity": 75,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 167,
    "name": "B-311",
    "building": "B",
    "floor": 3,
    "capacity": 15,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 168,
    "name": "B-312",
    "building": "B",
    "floor": 3,
    "capacity": 35,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 169,
    "name": "B-313",
    "building": "B",
    "floor": 3,
    "capacity": 80,
    "equipment": [
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 170,
    "name": "B-314",
    "building": "B",
    "floor": 3,
    "capacity": 18,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 171,
    "name": "B-315",
    "building": "B",
    "floor": 3,
    "capacity": 40,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 172,
    "name": "B-316",
    "building": "B",
    "floor": 3,
    "capacity": 100,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 173,
    "name": "B-317",
    "building": "B",
    "floor": 3,
    "capacity": 20,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 174,
    "name": "B-318",
    "building": "B",
    "floor": 3,
    "capacity": 45,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 175,
    "name": "B-319",
    "building": "B",
    "floor": 3,
    "capacity": 120,
    "equipment": [
      "audio"
    ]
  },
  {
    "id": 176,
    "name": "B-320",
    "building": "B",
    "floor": 3,
    "capacity": 24,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 177,
    "name": "B-321",
    "building": "B",
    "floor": 3,
    "capacity": 50,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 178,
    "name": "B-322",
    "building": "B",
    "floor": 3,
    "capacity": 150,
    "equipment": [
      "audio",
      "video"
    ]
  },
  {
    "id": 179,
    "name": "B-323",
    "building": "B",
    "floor": 3,
    "capacity": 25,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 180,
    "name": "B-324",
    "building": "B",
    "floor": 3,
    "capacity": 60,
    "equipment": [
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 181,
    "name": "B-325",
    "building": "B",
    "floor": 3,
    "capacity": 12,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 182,
    "name": "B-401",
    "building": "B",
    "floor": 4,
    "capacity": 45,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 183,
    "name": "B-402",
    "building": "B",
    "floor": 4,
    "capacity": 120,
    "equipment": [
      "audio"
    ]
  },
  {
    "id": 184,
    "name": "B-403",
    "building": "B",
    "floor": 4,
    "capacity": 24,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 185,
    "name": "B-404",
    "building": "B",
    "floor": 4,
    "capacity": 50,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 186,
    "name": "B-405",
    "building": "B",
    "floor": 4,
    "capacity": 150,
    "equipment": [
      "audio",
      "video"
    ]
  },
  {
    "id": 187,
    "name": "B-406",
    "building": "B",
    "floor": 4,
    "capacity": 25,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 188,
    "name": "B-407",
    "building": "B",
    "floor": 4,
    "capacity": 60,
    "equipment": [
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 189,
    "name": "B-408",
    "building": "B",
    "floor": 4,
    "capacity": 12,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 190,
    "name": "B-409",
    "building": "B",
    "floor": 4,
    "capacity": 30,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 191,
    "name": "B-410",
    "building": "B",
    "floor": 4,
    "capacity": 75,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 192,
    "name": "B-411",
    "building": "B",
    "floor": 4,
    "capacity": 15,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 193,
    "name": "B-412",
    "building": "B",
    "floor": 4,
    "capacity": 35,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 194,
    "name": "B-413",
    "building": "B",
    "floor": 4,
    "capacity": 80,
    "equipment": [
      "audio"
    ]
  },
  {
    "id": 195,
    "name": "B-414",
    "building": "B",
    "floor": 4,
    "capacity": 18,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 196,
    "name": "B-415",
    "building": "B",
    "floor": 4,
    "capacity": 40,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 197,
    "name": "B-416",
    "building": "B",
    "floor": 4,
    "capacity": 100,
    "equipment": [
      "audio",
      "video"
    ]
  },
  {
    "id": 198,
    "name": "B-417",
    "building": "B",
    "floor": 4,
    "capacity": 20,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 199,
    "name": "B-418",
    "building": "B",
    "floor": 4,
    "capacity": 45,
    "equipment": [
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 200,
    "name": "B-419",
    "building": "B",
    "floor": 4,
    "capacity": 120,
    "equipment": [
      "computers",
      "audio"
    ]
  },
  {
    "id": 201,
    "name": "B-420",
    "building": "B",
    "floor": 4,
    "capacity": 24,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 202,
    "name": "B-421",
    "building": "B",
    "floor": 4,
    "capacity": 50,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 203,
    "name": "B-422",
    "building": "B",
    "floor": 4,
    "capacity": 150,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 204,
    "name": "B-423",
    "building": "B",
    "floor": 4,
    "capacity": 25,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 205,
    "name": "B-424",
    "building": "B",
    "floor": 4,
    "capacity": 60,
    "equipment": [
      "audio"
    ]
  },
  {
    "id": 206,
    "name": "B-425",
    "building": "B",
    "floor": 4,
    "capacity": 12,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 207,
    "name": "C-101",
    "building": "C",
    "floor": 1,
    "capacity": 150,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 208,
    "name": "C-102",
    "building": "C",
    "floor": 1,
    "capacity": 25,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 209,
    "name": "C-103",
    "building": "C",
    "floor": 1,
    "capacity": 60,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 210,
    "name": "C-104",
    "building": "C",
    "floor": 1,
    "capacity": 12,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 211,
    "name": "C-105",
    "building": "C",
    "floor": 1,
    "capacity": 30,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 212,
    "name": "C-106",
    "building": "C",
    "floor": 1,
    "capacity": 75,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 213,
    "name": "C-107",
    "building": "C",
    "floor": 1,
    "capacity": 15,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 214,
    "name": "C-108",
    "building": "C",
    "floor": 1,
    "capacity": 35,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 215,
    "name": "C-109",
    "building": "C",
    "floor": 1,
    "capacity": 80,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 216,
    "name": "C-111",
    "building": "C",
    "floor": 1,
    "capacity": 40,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 217,
    "name": "C-112",
    "building": "C",
    "floor": 1,
    "capacity": 100,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 218,
    "name": "C-113",
    "building": "C",
    "floor": 1,
    "capacity": 20,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 219,
    "name": "C-114",
    "building": "C",
    "floor": 1,
    "capacity": 45,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 220,
    "name": "C-115",
    "building": "C",
    "floor": 1,
    "capacity": 120,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 221,
    "name": "C-116",
    "building": "C",
    "floor": 1,
    "capacity": 24,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 222,
    "name": "C-117",
    "building": "C",
    "floor": 1,
    "capacity": 50,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 223,
    "name": "C-118",
    "building": "C",
    "floor": 1,
    "capacity": 150,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 224,
    "name": "C-119",
    "building": "C",
    "floor": 1,
    "capacity": 25,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 225,
    "name": "C-120",
    "building": "C",
    "floor": 1,
    "capacity": 60,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 226,
    "name": "C-121",
    "building": "C",
    "floor": 1,
    "capacity": 12,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 227,
    "name": "C-122",
    "building": "C",
    "floor": 1,
    "capacity": 30,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 228,
    "name": "C-123",
    "building": "C",
    "floor": 1,
    "capacity": 75,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 229,
    "name": "C-124",
    "building": "C",
    "floor": 1,
    "capacity": 15,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 230,
    "name": "C-125",
    "building": "C",
    "floor": 1,
    "capacity": 35,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 231,
    "name": "C-201",
    "building": "C",
    "floor": 2,
    "capacity": 150,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 232,
    "name": "C-202",
    "building": "C",
    "floor": 2,
    "capacity": 25,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 233,
    "name": "C-203",
    "building": "C",
    "floor": 2,
    "capacity": 60,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 234,
    "name": "C-204",
    "building": "C",
    "floor": 2,
    "capacity": 12,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 235,
    "name": "C-205",
    "building": "C",
    "floor": 2,
    "capacity": 30,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 236,
    "name": "C-206",
    "building": "C",
    "floor": 2,
    "capacity": 75,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 237,
    "name": "C-207",
    "building": "C",
    "floor": 2,
    "capacity": 15,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 238,
    "name": "C-208",
    "building": "C",
    "floor": 2,
    "capacity": 35,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 239,
    "name": "C-209",
    "building": "C",
    "floor": 2,
    "capacity": 80,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 240,
    "name": "C-211",
    "building": "C",
    "floor": 2,
    "capacity": 40,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 241,
    "name": "C-212",
    "building": "C",
    "floor": 2,
    "capacity": 100,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 242,
    "name": "C-213",
    "building": "C",
    "floor": 2,
    "capacity": 20,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 243,
    "name": "C-214",
    "building": "C",
    "floor": 2,
    "capacity": 45,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 244,
    "name": "C-215",
    "building": "C",
    "floor": 2,
    "capacity": 120,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 245,
    "name": "C-216",
    "building": "C",
    "floor": 2,
    "capacity": 24,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 246,
    "name": "C-217",
    "building": "C",
    "floor": 2,
    "capacity": 50,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 247,
    "name": "C-218",
    "building": "C",
    "floor": 2,
    "capacity": 150,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 248,
    "name": "C-219",
    "building": "C",
    "floor": 2,
    "capacity": 25,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 249,
    "name": "C-220",
    "building": "C",
    "floor": 2,
    "capacity": 60,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 250,
    "name": "C-221",
    "building": "C",
    "floor": 2,
    "capacity": 12,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 251,
    "name": "C-222",
    "building": "C",
    "floor": 2,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 252,
    "name": "C-223",
    "building": "C",
    "floor": 2,
    "capacity": 75,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 253,
    "name": "C-224",
    "building": "C",
    "floor": 2,
    "capacity": 15,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 254,
    "name": "C-225",
    "building": "C",
    "floor": 2,
    "capacity": 35,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 255,
    "name": "C-302",
    "building": "C",
    "floor": 3,
    "capacity": 25,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 256,
    "name": "C-303",
    "building": "C",
    "floor": 3,
    "capacity": 60,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 257,
    "name": "C-304",
    "building": "C",
    "floor": 3,
    "capacity": 12,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 258,
    "name": "C-305",
    "building": "C",
    "floor": 3,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 259,
    "name": "C-306",
    "building": "C",
    "floor": 3,
    "capacity": 75,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 260,
    "name": "C-307",
    "building": "C",
    "floor": 3,
    "capacity": 15,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 261,
    "name": "C-308",
    "building": "C",
    "floor": 3,
    "capacity": 35,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 262,
    "name": "C-309",
    "building": "C",
    "floor": 3,
    "capacity": 80,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 263,
    "name": "C-310",
    "building": "C",
    "floor": 3,
    "capacity": 18,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 264,
    "name": "C-311",
    "building": "C",
    "floor": 3,
    "capacity": 40,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 265,
    "name": "C-312",
    "building": "C",
    "floor": 3,
    "capacity": 100,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 266,
    "name": "C-313",
    "building": "C",
    "floor": 3,
    "capacity": 20,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 267,
    "name": "C-314",
    "building": "C",
    "floor": 3,
    "capacity": 45,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 268,
    "name": "C-315",
    "building": "C",
    "floor": 3,
    "capacity": 120,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 269,
    "name": "C-316",
    "building": "C",
    "floor": 3,
    "capacity": 24,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 270,
    "name": "C-317",
    "building": "C",
    "floor": 3,
    "capacity": 50,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 271,
    "name": "C-318",
    "building": "C",
    "floor": 3,
    "capacity": 150,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 272,
    "name": "C-319",
    "building": "C",
    "floor": 3,
    "capacity": 25,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 273,
    "name": "C-320",
    "building": "C",
    "floor": 3,
    "capacity": 60,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 274,
    "name": "C-321",
    "building": "C",
    "floor": 3,
    "capacity": 12,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 275,
    "name": "C-322",
    "building": "C",
    "floor": 3,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 276,
    "name": "C-323",
    "building": "C",
    "floor": 3,
    "capacity": 75,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 277,
    "name": "C-324",
    "building": "C",
    "floor": 3,
    "capacity": 15,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 278,
    "name": "C-325",
    "building": "C",
    "floor": 3,
    "capacity": 35,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 279,
    "name": "C-401",
    "building": "C",
    "floor": 4,
    "capacity": 150,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 280,
    "name": "C-402",
    "building": "C",
    "floor": 4,
    "capacity": 25,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 281,
    "name": "C-403",
    "building": "C",
    "floor": 4,
    "capacity": 60,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 282,
    "name": "C-404",
    "building": "C",
    "floor": 4,
    "capacity": 12,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 283,
    "name": "C-405",
    "building": "C",
    "floor": 4,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 284,
    "name": "C-406",
    "building": "C",
    "floor": 4,
    "capacity": 75,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 285,
    "name": "C-407",
    "building": "C",
    "floor": 4,
    "capacity": 15,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 286,
    "name": "C-408",
    "building": "C",
    "floor": 4,
    "capacity": 35,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 287,
    "name": "C-409",
    "building": "C",
    "floor": 4,
    "capacity": 80,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 288,
    "name": "C-410",
    "building": "C",
    "floor": 4,
    "capacity": 18,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 289,
    "name": "C-411",
    "building": "C",
    "floor": 4,
    "capacity": 40,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 290,
    "name": "C-412",
    "building": "C",
    "floor": 4,
    "capacity": 100,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 291,
    "name": "C-413",
    "building": "C",
    "floor": 4,
    "capacity": 20,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 292,
    "name": "C-414",
    "building": "C",
    "floor": 4,
    "capacity": 45,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 293,
    "name": "C-415",
    "building": "C",
    "floor": 4,
    "capacity": 120,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 294,
    "name": "C-416",
    "building": "C",
    "floor": 4,
    "capacity": 24,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 295,
    "name": "C-417",
    "building": "C",
    "floor": 4,
    "capacity": 50,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 296,
    "name": "C-418",
    "building": "C",
    "floor": 4,
    "capacity": 150,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 297,
    "name": "C-419",
    "building": "C",
    "floor": 4,
    "capacity": 25,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 298,
    "name": "C-420",
    "building": "C",
    "floor": 4,
    "capacity": 60,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 299,
    "name": "C-421",
    "building": "C",
    "floor": 4,
    "capacity": 12,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 300,
    "name": "C-422",
    "building": "C",
    "floor": 4,
    "capacity": 30,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 301,
    "name": "C-423",
    "building": "C",
    "floor": 4,
    "capacity": 75,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 302,
    "name": "C-424",
    "building": "C",
    "floor": 4,
    "capacity": 15,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 303,
    "name": "C-425",
    "building": "C",
    "floor": 4,
    "capacity": 35,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 304,
    "name": "D-102",
    "building": "D",
    "floor": 1,
    "capacity": 75,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 305,
    "name": "D-103",
    "building": "D",
    "floor": 1,
    "capacity": 15,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 306,
    "name": "D-104",
    "building": "D",
    "floor": 1,
    "capacity": 35,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 307,
    "name": "D-105",
    "building": "D",
    "floor": 1,
    "capacity": 80,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 308,
    "name": "D-106",
    "building": "D",
    "floor": 1,
    "capacity": 18,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 309,
    "name": "D-107",
    "building": "D",
    "floor": 1,
    "capacity": 40,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 310,
    "name": "D-108",
    "building": "D",
    "floor": 1,
    "capacity": 100,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 311,
    "name": "D-109",
    "building": "D",
    "floor": 1,
    "capacity": 20,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 312,
    "name": "D-110",
    "building": "D",
    "floor": 1,
    "capacity": 45,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 313,
    "name": "D-111",
    "building": "D",
    "floor": 1,
    "capacity": 120,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 314,
    "name": "D-112",
    "building": "D",
    "floor": 1,
    "capacity": 24,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 315,
    "name": "D-113",
    "building": "D",
    "floor": 1,
    "capacity": 50,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 316,
    "name": "D-114",
    "building": "D",
    "floor": 1,
    "capacity": 150,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 317,
    "name": "D-115",
    "building": "D",
    "floor": 1,
    "capacity": 25,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 318,
    "name": "D-116",
    "building": "D",
    "floor": 1,
    "capacity": 60,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 319,
    "name": "D-117",
    "building": "D",
    "floor": 1,
    "capacity": 12,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 320,
    "name": "D-118",
    "building": "D",
    "floor": 1,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 321,
    "name": "D-119",
    "building": "D",
    "floor": 1,
    "capacity": 75,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 322,
    "name": "D-120",
    "building": "D",
    "floor": 1,
    "capacity": 15,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 323,
    "name": "D-121",
    "building": "D",
    "floor": 1,
    "capacity": 35,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 324,
    "name": "D-122",
    "building": "D",
    "floor": 1,
    "capacity": 80,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 325,
    "name": "D-123",
    "building": "D",
    "floor": 1,
    "capacity": 18,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 326,
    "name": "D-124",
    "building": "D",
    "floor": 1,
    "capacity": 40,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 327,
    "name": "D-125",
    "building": "D",
    "floor": 1,
    "capacity": 100,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 328,
    "name": "D-201",
    "building": "D",
    "floor": 2,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 329,
    "name": "D-203",
    "building": "D",
    "floor": 2,
    "capacity": 15,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 330,
    "name": "D-204",
    "building": "D",
    "floor": 2,
    "capacity": 35,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 331,
    "name": "D-205",
    "building": "D",
    "floor": 2,
    "capacity": 80,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 332,
    "name": "D-206",
    "building": "D",
    "floor": 2,
    "capacity": 18,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 333,
    "name": "D-207",
    "building": "D",
    "floor": 2,
    "capacity": 40,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 334,
    "name": "D-208",
    "building": "D",
    "floor": 2,
    "capacity": 100,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 335,
    "name": "D-209",
    "building": "D",
    "floor": 2,
    "capacity": 20,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 336,
    "name": "D-210",
    "building": "D",
    "floor": 2,
    "capacity": 45,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 337,
    "name": "D-211",
    "building": "D",
    "floor": 2,
    "capacity": 120,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 338,
    "name": "D-212",
    "building": "D",
    "floor": 2,
    "capacity": 24,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 339,
    "name": "D-213",
    "building": "D",
    "floor": 2,
    "capacity": 50,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 340,
    "name": "D-214",
    "building": "D",
    "floor": 2,
    "capacity": 150,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 341,
    "name": "D-215",
    "building": "D",
    "floor": 2,
    "capacity": 25,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 342,
    "name": "D-216",
    "building": "D",
    "floor": 2,
    "capacity": 60,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 343,
    "name": "D-217",
    "building": "D",
    "floor": 2,
    "capacity": 12,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 344,
    "name": "D-218",
    "building": "D",
    "floor": 2,
    "capacity": 30,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 345,
    "name": "D-219",
    "building": "D",
    "floor": 2,
    "capacity": 75,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 346,
    "name": "D-220",
    "building": "D",
    "floor": 2,
    "capacity": 15,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 347,
    "name": "D-221",
    "building": "D",
    "floor": 2,
    "capacity": 35,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 348,
    "name": "D-222",
    "building": "D",
    "floor": 2,
    "capacity": 80,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 349,
    "name": "D-223",
    "building": "D",
    "floor": 2,
    "capacity": 18,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 350,
    "name": "D-224",
    "building": "D",
    "floor": 2,
    "capacity": 40,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 351,
    "name": "D-225",
    "building": "D",
    "floor": 2,
    "capacity": 100,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 352,
    "name": "D-301",
    "building": "D",
    "floor": 3,
    "capacity": 30,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 353,
    "name": "D-302",
    "building": "D",
    "floor": 3,
    "capacity": 75,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 354,
    "name": "D-304",
    "building": "D",
    "floor": 3,
    "capacity": 35,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 355,
    "name": "D-305",
    "building": "D",
    "floor": 3,
    "capacity": 80,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 356,
    "name": "D-306",
    "building": "D",
    "floor": 3,
    "capacity": 18,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 357,
    "name": "D-307",
    "building": "D",
    "floor": 3,
    "capacity": 40,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 358,
    "name": "D-308",
    "building": "D",
    "floor": 3,
    "capacity": 100,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 359,
    "name": "D-309",
    "building": "D",
    "floor": 3,
    "capacity": 20,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 360,
    "name": "D-310",
    "building": "D",
    "floor": 3,
    "capacity": 45,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 361,
    "name": "D-311",
    "building": "D",
    "floor": 3,
    "capacity": 120,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 362,
    "name": "D-312",
    "building": "D",
    "floor": 3,
    "capacity": 24,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 363,
    "name": "D-313",
    "building": "D",
    "floor": 3,
    "capacity": 50,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 364,
    "name": "D-314",
    "building": "D",
    "floor": 3,
    "capacity": 150,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 365,
    "name": "D-315",
    "building": "D",
    "floor": 3,
    "capacity": 25,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 366,
    "name": "D-316",
    "building": "D",
    "floor": 3,
    "capacity": 60,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 367,
    "name": "D-317",
    "building": "D",
    "floor": 3,
    "capacity": 12,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 368,
    "name": "D-318",
    "building": "D",
    "floor": 3,
    "capacity": 30,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 369,
    "name": "D-319",
    "building": "D",
    "floor": 3,
    "capacity": 75,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 370,
    "name": "D-320",
    "building": "D",
    "floor": 3,
    "capacity": 15,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 371,
    "name": "D-321",
    "building": "D",
    "floor": 3,
    "capacity": 35,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 372,
    "name": "D-322",
    "building": "D",
    "floor": 3,
    "capacity": 80,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 373,
    "name": "D-323",
    "building": "D",
    "floor": 3,
    "capacity": 18,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 374,
    "name": "D-324",
    "building": "D",
    "floor": 3,
    "capacity": 40,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 375,
    "name": "D-325",
    "building": "D",
    "floor": 3,
    "capacity": 100,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 376,
    "name": "D-401",
    "building": "D",
    "floor": 4,
    "capacity": 30,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 377,
    "name": "D-402",
    "building": "D",
    "floor": 4,
    "capacity": 75,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 378,
    "name": "D-403",
    "building": "D",
    "floor": 4,
    "capacity": 15,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 379,
    "name": "D-405",
    "building": "D",
    "floor": 4,
    "capacity": 80,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 380,
    "name": "D-406",
    "building": "D",
    "floor": 4,
    "capacity": 18,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 381,
    "name": "D-407",
    "building": "D",
    "floor": 4,
    "capacity": 40,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 382,
    "name": "D-408",
    "building": "D",
    "floor": 4,
    "capacity": 100,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 383,
    "name": "D-409",
    "building": "D",
    "floor": 4,
    "capacity": 20,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 384,
    "name": "D-410",
    "building": "D",
    "floor": 4,
    "capacity": 45,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 385,
    "name": "D-411",
    "building": "D",
    "floor": 4,
    "capacity": 120,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 386,
    "name": "D-412",
    "building": "D",
    "floor": 4,
    "capacity": 24,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 387,
    "name": "D-413",
    "building": "D",
    "floor": 4,
    "capacity": 50,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 388,
    "name": "D-414",
    "building": "D",
    "floor": 4,
    "capacity": 150,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 389,
    "name": "D-415",
    "building": "D",
    "floor": 4,
    "capacity": 25,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 390,
    "name": "D-416",
    "building": "D",
    "floor": 4,
    "capacity": 60,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 391,
    "name": "D-417",
    "building": "D",
    "floor": 4,
    "capacity": 12,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 392,
    "name": "D-418",
    "building": "D",
    "floor": 4,
    "capacity": 30,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 393,
    "name": "D-419",
    "building": "D",
    "floor": 4,
    "capacity": 75,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 394,
    "name": "D-420",
    "building": "D",
    "floor": 4,
    "capacity": 15,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 395,
    "name": "D-421",
    "building": "D",
    "floor": 4,
    "capacity": 35,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 396,
    "name": "D-422",
    "building": "D",
    "floor": 4,
    "capacity": 80,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 397,
    "name": "D-423",
    "building": "D",
    "floor": 4,
    "capacity": 18,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 398,
    "name": "D-424",
    "building": "D",
    "floor": 4,
    "capacity": 40,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 399,
    "name": "D-425",
    "building": "D",
    "floor": 4,
    "capacity": 100,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 400,
    "name": "D-501",
    "building": "D",
    "floor": 5,
    "capacity": 30,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 401,
    "name": "E-101",
    "building": "E",
    "floor": 1,
    "capacity": 80,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 402,
    "name": "E-102",
    "building": "E",
    "floor": 1,
    "capacity": 18,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 403,
    "name": "E-103",
    "building": "E",
    "floor": 1,
    "capacity": 40,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 404,
    "name": "E-104",
    "building": "E",
    "floor": 1,
    "capacity": 100,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 405,
    "name": "E-105",
    "building": "E",
    "floor": 1,
    "capacity": 20,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 406,
    "name": "E-106",
    "building": "E",
    "floor": 1,
    "capacity": 45,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 407,
    "name": "E-107",
    "building": "E",
    "floor": 1,
    "capacity": 120,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 408,
    "name": "E-108",
    "building": "E",
    "floor": 1,
    "capacity": 24,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 409,
    "name": "E-109",
    "building": "E",
    "floor": 1,
    "capacity": 50,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 410,
    "name": "E-110",
    "building": "E",
    "floor": 1,
    "capacity": 150,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 411,
    "name": "E-111",
    "building": "E",
    "floor": 1,
    "capacity": 25,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 412,
    "name": "E-112",
    "building": "E",
    "floor": 1,
    "capacity": 60,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 413,
    "name": "E-113",
    "building": "E",
    "floor": 1,
    "capacity": 12,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 414,
    "name": "E-114",
    "building": "E",
    "floor": 1,
    "capacity": 30,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 415,
    "name": "E-115",
    "building": "E",
    "floor": 1,
    "capacity": 75,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 416,
    "name": "E-116",
    "building": "E",
    "floor": 1,
    "capacity": 15,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 417,
    "name": "E-117",
    "building": "E",
    "floor": 1,
    "capacity": 35,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 418,
    "name": "E-118",
    "building": "E",
    "floor": 1,
    "capacity": 80,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 419,
    "name": "E-119",
    "building": "E",
    "floor": 1,
    "capacity": 18,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 420,
    "name": "E-120",
    "building": "E",
    "floor": 1,
    "capacity": 40,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 421,
    "name": "E-121",
    "building": "E",
    "floor": 1,
    "capacity": 100,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 422,
    "name": "E-122",
    "building": "E",
    "floor": 1,
    "capacity": 20,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 423,
    "name": "E-123",
    "building": "E",
    "floor": 1,
    "capacity": 45,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 424,
    "name": "E-124",
    "building": "E",
    "floor": 1,
    "capacity": 120,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 425,
    "name": "E-125",
    "building": "E",
    "floor": 1,
    "capacity": 24,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 426,
    "name": "E-201",
    "building": "E",
    "floor": 2,
    "capacity": 80,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 427,
    "name": "E-202",
    "building": "E",
    "floor": 2,
    "capacity": 18,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 428,
    "name": "E-203",
    "building": "E",
    "floor": 2,
    "capacity": 40,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 429,
    "name": "E-204",
    "building": "E",
    "floor": 2,
    "capacity": 100,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 430,
    "name": "E-205",
    "building": "E",
    "floor": 2,
    "capacity": 20,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 431,
    "name": "E-206",
    "building": "E",
    "floor": 2,
    "capacity": 45,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 432,
    "name": "E-207",
    "building": "E",
    "floor": 2,
    "capacity": 120,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 433,
    "name": "E-208",
    "building": "E",
    "floor": 2,
    "capacity": 24,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 434,
    "name": "E-209",
    "building": "E",
    "floor": 2,
    "capacity": 50,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 435,
    "name": "E-210",
    "building": "E",
    "floor": 2,
    "capacity": 150,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 436,
    "name": "E-211",
    "building": "E",
    "floor": 2,
    "capacity": 25,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 437,
    "name": "E-212",
    "building": "E",
    "floor": 2,
    "capacity": 60,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 438,
    "name": "E-213",
    "building": "E",
    "floor": 2,
    "capacity": 12,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 439,
    "name": "E-214",
    "building": "E",
    "floor": 2,
    "capacity": 30,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 440,
    "name": "E-215",
    "building": "E",
    "floor": 2,
    "capacity": 75,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 441,
    "name": "E-216",
    "building": "E",
    "floor": 2,
    "capacity": 15,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 442,
    "name": "E-217",
    "building": "E",
    "floor": 2,
    "capacity": 35,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 443,
    "name": "E-218",
    "building": "E",
    "floor": 2,
    "capacity": 80,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 444,
    "name": "E-219",
    "building": "E",
    "floor": 2,
    "capacity": 18,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 445,
    "name": "E-220",
    "building": "E",
    "floor": 2,
    "capacity": 40,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 446,
    "name": "E-221",
    "building": "E",
    "floor": 2,
    "capacity": 100,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 447,
    "name": "E-222",
    "building": "E",
    "floor": 2,
    "capacity": 20,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 448,
    "name": "E-223",
    "building": "E",
    "floor": 2,
    "capacity": 45,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 449,
    "name": "E-224",
    "building": "E",
    "floor": 2,
    "capacity": 120,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 450,
    "name": "E-225",
    "building": "E",
    "floor": 2,
    "capacity": 24,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 451,
    "name": "E-301",
    "building": "E",
    "floor": 3,
    "capacity": 80,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 452,
    "name": "E-302",
    "building": "E",
    "floor": 3,
    "capacity": 18,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 453,
    "name": "E-303",
    "building": "E",
    "floor": 3,
    "capacity": 40,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 454,
    "name": "E-304",
    "building": "E",
    "floor": 3,
    "capacity": 100,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 455,
    "name": "E-305",
    "building": "E",
    "floor": 3,
    "capacity": 20,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 456,
    "name": "E-306",
    "building": "E",
    "floor": 3,
    "capacity": 45,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 457,
    "name": "E-307",
    "building": "E",
    "floor": 3,
    "capacity": 120,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 458,
    "name": "E-308",
    "building": "E",
    "floor": 3,
    "capacity": 24,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 459,
    "name": "E-309",
    "building": "E",
    "floor": 3,
    "capacity": 50,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 460,
    "name": "E-310",
    "building": "E",
    "floor": 3,
    "capacity": 150,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 461,
    "name": "E-311",
    "building": "E",
    "floor": 3,
    "capacity": 25,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 462,
    "name": "E-312",
    "building": "E",
    "floor": 3,
    "capacity": 60,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 463,
    "name": "E-313",
    "building": "E",
    "floor": 3,
    "capacity": 12,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 464,
    "name": "E-314",
    "building": "E",
    "floor": 3,
    "capacity": 30,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 465,
    "name": "E-315",
    "building": "E",
    "floor": 3,
    "capacity": 75,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 466,
    "name": "E-316",
    "building": "E",
    "floor": 3,
    "capacity": 15,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 467,
    "name": "E-317",
    "building": "E",
    "floor": 3,
    "capacity": 35,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 468,
    "name": "E-318",
    "building": "E",
    "floor": 3,
    "capacity": 80,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 469,
    "name": "E-319",
    "building": "E",
    "floor": 3,
    "capacity": 18,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 470,
    "name": "E-320",
    "building": "E",
    "floor": 3,
    "capacity": 40,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 471,
    "name": "E-321",
    "building": "E",
    "floor": 3,
    "capacity": 100,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 472,
    "name": "E-322",
    "building": "E",
    "floor": 3,
    "capacity": 20,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 473,
    "name": "E-323",
    "building": "E",
    "floor": 3,
    "capacity": 45,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 474,
    "name": "E-324",
    "building": "E",
    "floor": 3,
    "capacity": 120,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 475,
    "name": "E-325",
    "building": "E",
    "floor": 3,
    "capacity": 24,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 476,
    "name": "E-401",
    "building": "E",
    "floor": 4,
    "capacity": 80,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 477,
    "name": "E-402",
    "building": "E",
    "floor": 4,
    "capacity": 18,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 478,
    "name": "E-403",
    "building": "E",
    "floor": 4,
    "capacity": 40,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 479,
    "name": "E-404",
    "building": "E",
    "floor": 4,
    "capacity": 100,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 480,
    "name": "E-405",
    "building": "E",
    "floor": 4,
    "capacity": 20,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 481,
    "name": "E-406",
    "building": "E",
    "floor": 4,
    "capacity": 45,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 482,
    "name": "E-407",
    "building": "E",
    "floor": 4,
    "capacity": 120,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 483,
    "name": "E-408",
    "building": "E",
    "floor": 4,
    "capacity": 24,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 484,
    "name": "E-409",
    "building": "E",
    "floor": 4,
    "capacity": 50,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 485,
    "name": "E-410",
    "building": "E",
    "floor": 4,
    "capacity": 150,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 486,
    "name": "E-411",
    "building": "E",
    "floor": 4,
    "capacity": 25,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 487,
    "name": "E-412",
    "building": "E",
    "floor": 4,
    "capacity": 60,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 488,
    "name": "E-413",
    "building": "E",
    "floor": 4,
    "capacity": 12,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 489,
    "name": "E-414",
    "building": "E",
    "floor": 4,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 490,
    "name": "E-415",
    "building": "E",
    "floor": 4,
    "capacity": 75,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 491,
    "name": "E-416",
    "building": "E",
    "floor": 4,
    "capacity": 15,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 492,
    "name": "E-417",
    "building": "E",
    "floor": 4,
    "capacity": 35,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 493,
    "name": "E-418",
    "building": "E",
    "floor": 4,
    "capacity": 80,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 494,
    "name": "E-419",
    "building": "E",
    "floor": 4,
    "capacity": 18,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 495,
    "name": "E-420",
    "building": "E",
    "floor": 4,
    "capacity": 40,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 496,
    "name": "E-421",
    "building": "E",
    "floor": 4,
    "capacity": 100,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 497,
    "name": "E-422",
    "building": "E",
    "floor": 4,
    "capacity": 20,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 498,
    "name": "E-423",
    "building": "E",
    "floor": 4,
    "capacity": 45,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 499,
    "name": "E-424",
    "building": "E",
    "floor": 4,
    "capacity": 120,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 500,
    "name": "E-425",
    "building": "E",
    "floor": 4,
    "capacity": 24,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 501,
    "name": "F-101",
    "building": "F",
    "floor": 1,
    "capacity": 20,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 502,
    "name": "F-102",
    "building": "F",
    "floor": 1,
    "capacity": 45,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 503,
    "name": "F-103",
    "building": "F",
    "floor": 1,
    "capacity": 120,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 504,
    "name": "F-104",
    "building": "F",
    "floor": 1,
    "capacity": 24,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 505,
    "name": "F-105",
    "building": "F",
    "floor": 1,
    "capacity": 50,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 506,
    "name": "F-106",
    "building": "F",
    "floor": 1,
    "capacity": 150,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 507,
    "name": "F-107",
    "building": "F",
    "floor": 1,
    "capacity": 25,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 508,
    "name": "F-108",
    "building": "F",
    "floor": 1,
    "capacity": 60,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 509,
    "name": "F-109",
    "building": "F",
    "floor": 1,
    "capacity": 12,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 510,
    "name": "F-110",
    "building": "F",
    "floor": 1,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 511,
    "name": "F-111",
    "building": "F",
    "floor": 1,
    "capacity": 75,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 512,
    "name": "F-112",
    "building": "F",
    "floor": 1,
    "capacity": 15,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 513,
    "name": "F-113",
    "building": "F",
    "floor": 1,
    "capacity": 35,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 514,
    "name": "F-114",
    "building": "F",
    "floor": 1,
    "capacity": 80,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 515,
    "name": "F-115",
    "building": "F",
    "floor": 1,
    "capacity": 18,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 516,
    "name": "F-116",
    "building": "F",
    "floor": 1,
    "capacity": 40,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 517,
    "name": "F-117",
    "building": "F",
    "floor": 1,
    "capacity": 100,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 518,
    "name": "F-118",
    "building": "F",
    "floor": 1,
    "capacity": 20,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 519,
    "name": "F-119",
    "building": "F",
    "floor": 1,
    "capacity": 45,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 520,
    "name": "F-120",
    "building": "F",
    "floor": 1,
    "capacity": 120,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 521,
    "name": "F-121",
    "building": "F",
    "floor": 1,
    "capacity": 24,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 522,
    "name": "F-122",
    "building": "F",
    "floor": 1,
    "capacity": 50,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 523,
    "name": "F-123",
    "building": "F",
    "floor": 1,
    "capacity": 150,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 524,
    "name": "F-124",
    "building": "F",
    "floor": 1,
    "capacity": 25,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 525,
    "name": "F-125",
    "building": "F",
    "floor": 1,
    "capacity": 60,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 526,
    "name": "F-201",
    "building": "F",
    "floor": 2,
    "capacity": 20,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 527,
    "name": "F-202",
    "building": "F",
    "floor": 2,
    "capacity": 45,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 528,
    "name": "F-203",
    "building": "F",
    "floor": 2,
    "capacity": 120,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 529,
    "name": "F-204",
    "building": "F",
    "floor": 2,
    "capacity": 24,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 530,
    "name": "F-205",
    "building": "F",
    "floor": 2,
    "capacity": 50,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 531,
    "name": "F-206",
    "building": "F",
    "floor": 2,
    "capacity": 150,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 532,
    "name": "F-207",
    "building": "F",
    "floor": 2,
    "capacity": 25,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 533,
    "name": "F-208",
    "building": "F",
    "floor": 2,
    "capacity": 60,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 534,
    "name": "F-209",
    "building": "F",
    "floor": 2,
    "capacity": 12,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 535,
    "name": "F-210",
    "building": "F",
    "floor": 2,
    "capacity": 30,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 536,
    "name": "F-211",
    "building": "F",
    "floor": 2,
    "capacity": 75,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 537,
    "name": "F-212",
    "building": "F",
    "floor": 2,
    "capacity": 15,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 538,
    "name": "F-213",
    "building": "F",
    "floor": 2,
    "capacity": 35,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 539,
    "name": "F-214",
    "building": "F",
    "floor": 2,
    "capacity": 80,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 540,
    "name": "F-215",
    "building": "F",
    "floor": 2,
    "capacity": 18,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 541,
    "name": "F-216",
    "building": "F",
    "floor": 2,
    "capacity": 40,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 542,
    "name": "F-217",
    "building": "F",
    "floor": 2,
    "capacity": 100,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 543,
    "name": "F-218",
    "building": "F",
    "floor": 2,
    "capacity": 20,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 544,
    "name": "F-219",
    "building": "F",
    "floor": 2,
    "capacity": 45,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 545,
    "name": "F-220",
    "building": "F",
    "floor": 2,
    "capacity": 120,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 546,
    "name": "F-221",
    "building": "F",
    "floor": 2,
    "capacity": 24,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 547,
    "name": "F-222",
    "building": "F",
    "floor": 2,
    "capacity": 50,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 548,
    "name": "F-223",
    "building": "F",
    "floor": 2,
    "capacity": 150,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 549,
    "name": "F-224",
    "building": "F",
    "floor": 2,
    "capacity": 25,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 550,
    "name": "F-225",
    "building": "F",
    "floor": 2,
    "capacity": 60,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 551,
    "name": "F-301",
    "building": "F",
    "floor": 3,
    "capacity": 20,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 552,
    "name": "F-302",
    "building": "F",
    "floor": 3,
    "capacity": 45,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 553,
    "name": "F-303",
    "building": "F",
    "floor": 3,
    "capacity": 120,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 554,
    "name": "F-304",
    "building": "F",
    "floor": 3,
    "capacity": 24,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 555,
    "name": "F-305",
    "building": "F",
    "floor": 3,
    "capacity": 50,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 556,
    "name": "F-306",
    "building": "F",
    "floor": 3,
    "capacity": 150,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 557,
    "name": "F-307",
    "building": "F",
    "floor": 3,
    "capacity": 25,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 558,
    "name": "F-308",
    "building": "F",
    "floor": 3,
    "capacity": 60,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 559,
    "name": "F-309",
    "building": "F",
    "floor": 3,
    "capacity": 12,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 560,
    "name": "F-310",
    "building": "F",
    "floor": 3,
    "capacity": 30,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 561,
    "name": "F-311",
    "building": "F",
    "floor": 3,
    "capacity": 75,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 562,
    "name": "F-312",
    "building": "F",
    "floor": 3,
    "capacity": 15,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 563,
    "name": "F-313",
    "building": "F",
    "floor": 3,
    "capacity": 35,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 564,
    "name": "F-314",
    "building": "F",
    "floor": 3,
    "capacity": 80,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 565,
    "name": "F-315",
    "building": "F",
    "floor": 3,
    "capacity": 18,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 566,
    "name": "F-316",
    "building": "F",
    "floor": 3,
    "capacity": 40,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 567,
    "name": "F-317",
    "building": "F",
    "floor": 3,
    "capacity": 100,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 568,
    "name": "F-318",
    "building": "F",
    "floor": 3,
    "capacity": 20,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 569,
    "name": "F-319",
    "building": "F",
    "floor": 3,
    "capacity": 45,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 570,
    "name": "F-320",
    "building": "F",
    "floor": 3,
    "capacity": 120,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 571,
    "name": "F-321",
    "building": "F",
    "floor": 3,
    "capacity": 24,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 572,
    "name": "F-322",
    "building": "F",
    "floor": 3,
    "capacity": 50,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 573,
    "name": "F-323",
    "building": "F",
    "floor": 3,
    "capacity": 150,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 574,
    "name": "F-324",
    "building": "F",
    "floor": 3,
    "capacity": 25,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 575,
    "name": "F-325",
    "building": "F",
    "floor": 3,
    "capacity": 60,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 576,
    "name": "F-401",
    "building": "F",
    "floor": 4,
    "capacity": 20,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 577,
    "name": "F-402",
    "building": "F",
    "floor": 4,
    "capacity": 45,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 578,
    "name": "F-403",
    "building": "F",
    "floor": 4,
    "capacity": 120,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 579,
    "name": "F-404",
    "building": "F",
    "floor": 4,
    "capacity": 24,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 580,
    "name": "F-405",
    "building": "F",
    "floor": 4,
    "capacity": 50,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 581,
    "name": "F-406",
    "building": "F",
    "floor": 4,
    "capacity": 150,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 582,
    "name": "F-407",
    "building": "F",
    "floor": 4,
    "capacity": 25,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 583,
    "name": "F-408",
    "building": "F",
    "floor": 4,
    "capacity": 60,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 584,
    "name": "F-409",
    "building": "F",
    "floor": 4,
    "capacity": 12,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 585,
    "name": "F-410",
    "building": "F",
    "floor": 4,
    "capacity": 30,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 586,
    "name": "F-411",
    "building": "F",
    "floor": 4,
    "capacity": 75,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 587,
    "name": "F-412",
    "building": "F",
    "floor": 4,
    "capacity": 15,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 588,
    "name": "F-413",
    "building": "F",
    "floor": 4,
    "capacity": 35,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 589,
    "name": "F-414",
    "building": "F",
    "floor": 4,
    "capacity": 80,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 590,
    "name": "F-415",
    "building": "F",
    "floor": 4,
    "capacity": 18,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 591,
    "name": "F-416",
    "building": "F",
    "floor": 4,
    "capacity": 40,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 592,
    "name": "F-417",
    "building": "F",
    "floor": 4,
    "capacity": 100,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 593,
    "name": "F-418",
    "building": "F",
    "floor": 4,
    "capacity": 20,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 594,
    "name": "F-419",
    "building": "F",
    "floor": 4,
    "capacity": 45,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 595,
    "name": "F-420",
    "building": "F",
    "floor": 4,
    "capacity": 120,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 596,
    "name": "F-421",
    "building": "F",
    "floor": 4,
    "capacity": 24,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 597,
    "name": "F-422",
    "building": "F",
    "floor": 4,
    "capacity": 50,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 598,
    "name": "F-423",
    "building": "F",
    "floor": 4,
    "capacity": 150,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 599,
    "name": "F-424",
    "building": "F",
    "floor": 4,
    "capacity": 25,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 600,
    "name": "F-425",
    "building": "F",
    "floor": 4,
    "capacity": 60,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 601,
    "name": "G-101",
    "building": "G",
    "floor": 1,
    "capacity": 50,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 602,
    "name": "G-102",
    "building": "G",
    "floor": 1,
    "capacity": 150,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 603,
    "name": "G-103",
    "building": "G",
    "floor": 1,
    "capacity": 25,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 604,
    "name": "G-104",
    "building": "G",
    "floor": 1,
    "capacity": 60,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 605,
    "name": "G-105",
    "building": "G",
    "floor": 1,
    "capacity": 12,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 606,
    "name": "G-106",
    "building": "G",
    "floor": 1,
    "capacity": 30,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 607,
    "name": "G-107",
    "building": "G",
    "floor": 1,
    "capacity": 75,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 608,
    "name": "G-108",
    "building": "G",
    "floor": 1,
    "capacity": 15,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 609,
    "name": "G-109",
    "building": "G",
    "floor": 1,
    "capacity": 35,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 610,
    "name": "G-110",
    "building": "G",
    "floor": 1,
    "capacity": 80,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 611,
    "name": "G-111",
    "building": "G",
    "floor": 1,
    "capacity": 18,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 612,
    "name": "G-112",
    "building": "G",
    "floor": 1,
    "capacity": 40,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 613,
    "name": "G-113",
    "building": "G",
    "floor": 1,
    "capacity": 100,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 614,
    "name": "G-114",
    "building": "G",
    "floor": 1,
    "capacity": 20,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 615,
    "name": "G-115",
    "building": "G",
    "floor": 1,
    "capacity": 45,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 616,
    "name": "G-116",
    "building": "G",
    "floor": 1,
    "capacity": 120,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 617,
    "name": "G-117",
    "building": "G",
    "floor": 1,
    "capacity": 24,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 618,
    "name": "G-118",
    "building": "G",
    "floor": 1,
    "capacity": 50,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 619,
    "name": "G-119",
    "building": "G",
    "floor": 1,
    "capacity": 150,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 620,
    "name": "G-120",
    "building": "G",
    "floor": 1,
    "capacity": 25,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 621,
    "name": "G-121",
    "building": "G",
    "floor": 1,
    "capacity": 60,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 622,
    "name": "G-122",
    "building": "G",
    "floor": 1,
    "capacity": 12,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 623,
    "name": "G-123",
    "building": "G",
    "floor": 1,
    "capacity": 30,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 624,
    "name": "G-124",
    "building": "G",
    "floor": 1,
    "capacity": 75,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 625,
    "name": "G-125",
    "building": "G",
    "floor": 1,
    "capacity": 15,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 626,
    "name": "G-201",
    "building": "G",
    "floor": 2,
    "capacity": 50,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 627,
    "name": "G-202",
    "building": "G",
    "floor": 2,
    "capacity": 150,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 628,
    "name": "G-203",
    "building": "G",
    "floor": 2,
    "capacity": 25,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 629,
    "name": "G-204",
    "building": "G",
    "floor": 2,
    "capacity": 60,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 630,
    "name": "G-205",
    "building": "G",
    "floor": 2,
    "capacity": 12,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 631,
    "name": "G-206",
    "building": "G",
    "floor": 2,
    "capacity": 30,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 632,
    "name": "G-207",
    "building": "G",
    "floor": 2,
    "capacity": 75,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 633,
    "name": "G-208",
    "building": "G",
    "floor": 2,
    "capacity": 15,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 634,
    "name": "G-209",
    "building": "G",
    "floor": 2,
    "capacity": 35,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 635,
    "name": "G-210",
    "building": "G",
    "floor": 2,
    "capacity": 80,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 636,
    "name": "G-211",
    "building": "G",
    "floor": 2,
    "capacity": 18,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 637,
    "name": "G-212",
    "building": "G",
    "floor": 2,
    "capacity": 40,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 638,
    "name": "G-213",
    "building": "G",
    "floor": 2,
    "capacity": 100,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 639,
    "name": "G-214",
    "building": "G",
    "floor": 2,
    "capacity": 20,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 640,
    "name": "G-215",
    "building": "G",
    "floor": 2,
    "capacity": 45,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 641,
    "name": "G-216",
    "building": "G",
    "floor": 2,
    "capacity": 120,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 642,
    "name": "G-217",
    "building": "G",
    "floor": 2,
    "capacity": 24,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 643,
    "name": "G-218",
    "building": "G",
    "floor": 2,
    "capacity": 50,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 644,
    "name": "G-219",
    "building": "G",
    "floor": 2,
    "capacity": 150,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 645,
    "name": "G-220",
    "building": "G",
    "floor": 2,
    "capacity": 25,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 646,
    "name": "G-221",
    "building": "G",
    "floor": 2,
    "capacity": 60,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 647,
    "name": "G-222",
    "building": "G",
    "floor": 2,
    "capacity": 12,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 648,
    "name": "G-223",
    "building": "G",
    "floor": 2,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 649,
    "name": "G-224",
    "building": "G",
    "floor": 2,
    "capacity": 75,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 650,
    "name": "G-225",
    "building": "G",
    "floor": 2,
    "capacity": 15,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 651,
    "name": "G-301",
    "building": "G",
    "floor": 3,
    "capacity": 50,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 652,
    "name": "G-302",
    "building": "G",
    "floor": 3,
    "capacity": 150,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 653,
    "name": "G-303",
    "building": "G",
    "floor": 3,
    "capacity": 25,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 654,
    "name": "G-304",
    "building": "G",
    "floor": 3,
    "capacity": 60,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 655,
    "name": "G-305",
    "building": "G",
    "floor": 3,
    "capacity": 12,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 656,
    "name": "G-306",
    "building": "G",
    "floor": 3,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 657,
    "name": "G-307",
    "building": "G",
    "floor": 3,
    "capacity": 75,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 658,
    "name": "G-308",
    "building": "G",
    "floor": 3,
    "capacity": 15,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 659,
    "name": "G-309",
    "building": "G",
    "floor": 3,
    "capacity": 35,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 660,
    "name": "G-310",
    "building": "G",
    "floor": 3,
    "capacity": 80,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 661,
    "name": "G-311",
    "building": "G",
    "floor": 3,
    "capacity": 18,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 662,
    "name": "G-312",
    "building": "G",
    "floor": 3,
    "capacity": 40,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 663,
    "name": "G-313",
    "building": "G",
    "floor": 3,
    "capacity": 100,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 664,
    "name": "G-314",
    "building": "G",
    "floor": 3,
    "capacity": 20,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 665,
    "name": "G-315",
    "building": "G",
    "floor": 3,
    "capacity": 45,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 666,
    "name": "G-316",
    "building": "G",
    "floor": 3,
    "capacity": 120,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 667,
    "name": "G-317",
    "building": "G",
    "floor": 3,
    "capacity": 24,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 668,
    "name": "G-318",
    "building": "G",
    "floor": 3,
    "capacity": 50,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 669,
    "name": "G-319",
    "building": "G",
    "floor": 3,
    "capacity": 150,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 670,
    "name": "G-320",
    "building": "G",
    "floor": 3,
    "capacity": 25,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 671,
    "name": "G-321",
    "building": "G",
    "floor": 3,
    "capacity": 60,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 672,
    "name": "G-322",
    "building": "G",
    "floor": 3,
    "capacity": 12,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 673,
    "name": "G-323",
    "building": "G",
    "floor": 3,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 674,
    "name": "G-324",
    "building": "G",
    "floor": 3,
    "capacity": 75,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 675,
    "name": "G-325",
    "building": "G",
    "floor": 3,
    "capacity": 15,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 676,
    "name": "G-401",
    "building": "G",
    "floor": 4,
    "capacity": 50,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 677,
    "name": "G-402",
    "building": "G",
    "floor": 4,
    "capacity": 150,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 678,
    "name": "G-403",
    "building": "G",
    "floor": 4,
    "capacity": 25,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 679,
    "name": "G-404",
    "building": "G",
    "floor": 4,
    "capacity": 60,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 680,
    "name": "G-405",
    "building": "G",
    "floor": 4,
    "capacity": 12,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 681,
    "name": "G-406",
    "building": "G",
    "floor": 4,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 682,
    "name": "G-407",
    "building": "G",
    "floor": 4,
    "capacity": 75,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 683,
    "name": "G-408",
    "building": "G",
    "floor": 4,
    "capacity": 15,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 684,
    "name": "G-409",
    "building": "G",
    "floor": 4,
    "capacity": 35,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 685,
    "name": "G-410",
    "building": "G",
    "floor": 4,
    "capacity": 80,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 686,
    "name": "G-411",
    "building": "G",
    "floor": 4,
    "capacity": 18,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 687,
    "name": "G-412",
    "building": "G",
    "floor": 4,
    "capacity": 40,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 688,
    "name": "G-413",
    "building": "G",
    "floor": 4,
    "capacity": 100,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 689,
    "name": "G-414",
    "building": "G",
    "floor": 4,
    "capacity": 20,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 690,
    "name": "G-415",
    "building": "G",
    "floor": 4,
    "capacity": 45,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 691,
    "name": "G-416",
    "building": "G",
    "floor": 4,
    "capacity": 120,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 692,
    "name": "G-417",
    "building": "G",
    "floor": 4,
    "capacity": 24,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 693,
    "name": "G-418",
    "building": "G",
    "floor": 4,
    "capacity": 50,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 694,
    "name": "G-419",
    "building": "G",
    "floor": 4,
    "capacity": 150,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 695,
    "name": "G-420",
    "building": "G",
    "floor": 4,
    "capacity": 25,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 696,
    "name": "G-421",
    "building": "G",
    "floor": 4,
    "capacity": 60,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 697,
    "name": "G-422",
    "building": "G",
    "floor": 4,
    "capacity": 12,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 698,
    "name": "G-423",
    "building": "G",
    "floor": 4,
    "capacity": 30,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 699,
    "name": "G-424",
    "building": "G",
    "floor": 4,
    "capacity": 75,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 700,
    "name": "G-425",
    "building": "G",
    "floor": 4,
    "capacity": 15,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 701,
    "name": "H-101",
    "building": "H",
    "floor": 1,
    "capacity": 12,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 702,
    "name": "H-102",
    "building": "H",
    "floor": 1,
    "capacity": 30,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 703,
    "name": "H-103",
    "building": "H",
    "floor": 1,
    "capacity": 75,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 704,
    "name": "H-104",
    "building": "H",
    "floor": 1,
    "capacity": 15,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 705,
    "name": "H-105",
    "building": "H",
    "floor": 1,
    "capacity": 35,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 706,
    "name": "H-106",
    "building": "H",
    "floor": 1,
    "capacity": 80,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 707,
    "name": "H-107",
    "building": "H",
    "floor": 1,
    "capacity": 18,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 708,
    "name": "H-108",
    "building": "H",
    "floor": 1,
    "capacity": 40,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 709,
    "name": "H-109",
    "building": "H",
    "floor": 1,
    "capacity": 100,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 710,
    "name": "H-110",
    "building": "H",
    "floor": 1,
    "capacity": 20,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 711,
    "name": "H-111",
    "building": "H",
    "floor": 1,
    "capacity": 45,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 712,
    "name": "H-112",
    "building": "H",
    "floor": 1,
    "capacity": 120,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 713,
    "name": "H-113",
    "building": "H",
    "floor": 1,
    "capacity": 24,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 714,
    "name": "H-114",
    "building": "H",
    "floor": 1,
    "capacity": 50,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 715,
    "name": "H-115",
    "building": "H",
    "floor": 1,
    "capacity": 150,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 716,
    "name": "H-116",
    "building": "H",
    "floor": 1,
    "capacity": 25,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 717,
    "name": "H-117",
    "building": "H",
    "floor": 1,
    "capacity": 60,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 718,
    "name": "H-118",
    "building": "H",
    "floor": 1,
    "capacity": 12,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 719,
    "name": "H-119",
    "building": "H",
    "floor": 1,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 720,
    "name": "H-120",
    "building": "H",
    "floor": 1,
    "capacity": 75,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 721,
    "name": "H-121",
    "building": "H",
    "floor": 1,
    "capacity": 15,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 722,
    "name": "H-122",
    "building": "H",
    "floor": 1,
    "capacity": 35,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 723,
    "name": "H-123",
    "building": "H",
    "floor": 1,
    "capacity": 80,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 724,
    "name": "H-124",
    "building": "H",
    "floor": 1,
    "capacity": 18,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 725,
    "name": "H-125",
    "building": "H",
    "floor": 1,
    "capacity": 40,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 726,
    "name": "H-201",
    "building": "H",
    "floor": 2,
    "capacity": 12,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 727,
    "name": "H-202",
    "building": "H",
    "floor": 2,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 728,
    "name": "H-203",
    "building": "H",
    "floor": 2,
    "capacity": 75,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 729,
    "name": "H-204",
    "building": "H",
    "floor": 2,
    "capacity": 15,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 730,
    "name": "H-205",
    "building": "H",
    "floor": 2,
    "capacity": 35,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 731,
    "name": "H-206",
    "building": "H",
    "floor": 2,
    "capacity": 80,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 732,
    "name": "H-207",
    "building": "H",
    "floor": 2,
    "capacity": 18,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 733,
    "name": "H-208",
    "building": "H",
    "floor": 2,
    "capacity": 40,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 734,
    "name": "H-209",
    "building": "H",
    "floor": 2,
    "capacity": 100,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 735,
    "name": "H-210",
    "building": "H",
    "floor": 2,
    "capacity": 20,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 736,
    "name": "H-211",
    "building": "H",
    "floor": 2,
    "capacity": 45,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 737,
    "name": "H-212",
    "building": "H",
    "floor": 2,
    "capacity": 120,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 738,
    "name": "H-213",
    "building": "H",
    "floor": 2,
    "capacity": 24,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 739,
    "name": "H-214",
    "building": "H",
    "floor": 2,
    "capacity": 50,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 740,
    "name": "H-215",
    "building": "H",
    "floor": 2,
    "capacity": 150,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 741,
    "name": "H-216",
    "building": "H",
    "floor": 2,
    "capacity": 25,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 742,
    "name": "H-217",
    "building": "H",
    "floor": 2,
    "capacity": 60,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 743,
    "name": "H-218",
    "building": "H",
    "floor": 2,
    "capacity": 12,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 744,
    "name": "H-219",
    "building": "H",
    "floor": 2,
    "capacity": 30,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 745,
    "name": "H-220",
    "building": "H",
    "floor": 2,
    "capacity": 75,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 746,
    "name": "H-221",
    "building": "H",
    "floor": 2,
    "capacity": 15,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 747,
    "name": "H-222",
    "building": "H",
    "floor": 2,
    "capacity": 35,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 748,
    "name": "H-223",
    "building": "H",
    "floor": 2,
    "capacity": 80,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 749,
    "name": "H-224",
    "building": "H",
    "floor": 2,
    "capacity": 18,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 750,
    "name": "H-225",
    "building": "H",
    "floor": 2,
    "capacity": 40,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 751,
    "name": "H-301",
    "building": "H",
    "floor": 3,
    "capacity": 12,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 752,
    "name": "H-302",
    "building": "H",
    "floor": 3,
    "capacity": 30,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 753,
    "name": "H-303",
    "building": "H",
    "floor": 3,
    "capacity": 75,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 754,
    "name": "H-304",
    "building": "H",
    "floor": 3,
    "capacity": 15,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 755,
    "name": "H-305",
    "building": "H",
    "floor": 3,
    "capacity": 35,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 756,
    "name": "H-306",
    "building": "H",
    "floor": 3,
    "capacity": 80,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 757,
    "name": "H-307",
    "building": "H",
    "floor": 3,
    "capacity": 18,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 758,
    "name": "H-308",
    "building": "H",
    "floor": 3,
    "capacity": 40,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 759,
    "name": "H-309",
    "building": "H",
    "floor": 3,
    "capacity": 100,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 760,
    "name": "H-310",
    "building": "H",
    "floor": 3,
    "capacity": 20,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 761,
    "name": "H-311",
    "building": "H",
    "floor": 3,
    "capacity": 45,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 762,
    "name": "H-312",
    "building": "H",
    "floor": 3,
    "capacity": 120,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 763,
    "name": "H-313",
    "building": "H",
    "floor": 3,
    "capacity": 24,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 764,
    "name": "H-314",
    "building": "H",
    "floor": 3,
    "capacity": 50,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 765,
    "name": "H-315",
    "building": "H",
    "floor": 3,
    "capacity": 150,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 766,
    "name": "H-316",
    "building": "H",
    "floor": 3,
    "capacity": 25,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 767,
    "name": "H-317",
    "building": "H",
    "floor": 3,
    "capacity": 60,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 768,
    "name": "H-318",
    "building": "H",
    "floor": 3,
    "capacity": 12,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 769,
    "name": "H-319",
    "building": "H",
    "floor": 3,
    "capacity": 30,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 770,
    "name": "H-320",
    "building": "H",
    "floor": 3,
    "capacity": 75,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 771,
    "name": "H-321",
    "building": "H",
    "floor": 3,
    "capacity": 15,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 772,
    "name": "H-322",
    "building": "H",
    "floor": 3,
    "capacity": 35,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 773,
    "name": "H-323",
    "building": "H",
    "floor": 3,
    "capacity": 80,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 774,
    "name": "H-324",
    "building": "H",
    "floor": 3,
    "capacity": 18,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 775,
    "name": "H-325",
    "building": "H",
    "floor": 3,
    "capacity": 40,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 776,
    "name": "H-401",
    "building": "H",
    "floor": 4,
    "capacity": 12,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 777,
    "name": "H-402",
    "building": "H",
    "floor": 4,
    "capacity": 30,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 778,
    "name": "H-403",
    "building": "H",
    "floor": 4,
    "capacity": 75,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 779,
    "name": "H-404",
    "building": "H",
    "floor": 4,
    "capacity": 15,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 780,
    "name": "H-405",
    "building": "H",
    "floor": 4,
    "capacity": 35,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 781,
    "name": "H-406",
    "building": "H",
    "floor": 4,
    "capacity": 80,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 782,
    "name": "H-407",
    "building": "H",
    "floor": 4,
    "capacity": 18,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 783,
    "name": "H-408",
    "building": "H",
    "floor": 4,
    "capacity": 40,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 784,
    "name": "H-409",
    "building": "H",
    "floor": 4,
    "capacity": 100,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 785,
    "name": "H-410",
    "building": "H",
    "floor": 4,
    "capacity": 20,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 786,
    "name": "H-411",
    "building": "H",
    "floor": 4,
    "capacity": 45,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 787,
    "name": "H-412",
    "building": "H",
    "floor": 4,
    "capacity": 120,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 788,
    "name": "H-413",
    "building": "H",
    "floor": 4,
    "capacity": 24,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 789,
    "name": "H-414",
    "building": "H",
    "floor": 4,
    "capacity": 50,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 790,
    "name": "H-415",
    "building": "H",
    "floor": 4,
    "capacity": 150,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 791,
    "name": "H-416",
    "building": "H",
    "floor": 4,
    "capacity": 25,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 792,
    "name": "H-417",
    "building": "H",
    "floor": 4,
    "capacity": 60,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 793,
    "name": "H-418",
    "building": "H",
    "floor": 4,
    "capacity": 12,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 794,
    "name": "H-419",
    "building": "H",
    "floor": 4,
    "capacity": 30,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 795,
    "name": "H-420",
    "building": "H",
    "floor": 4,
    "capacity": 75,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 796,
    "name": "H-421",
    "building": "H",
    "floor": 4,
    "capacity": 15,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 797,
    "name": "H-422",
    "building": "H",
    "floor": 4,
    "capacity": 35,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 798,
    "name": "H-423",
    "building": "H",
    "floor": 4,
    "capacity": 80,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 799,
    "name": "H-424",
    "building": "H",
    "floor": 4,
    "capacity": 18,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 800,
    "name": "H-425",
    "building": "H",
    "floor": 4,
    "capacity": 40,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 801,
    "name": "I-101",
    "building": "I",
    "floor": 1,
    "capacity": 35,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 802,
    "name": "I-102",
    "building": "I",
    "floor": 1,
    "capacity": 80,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 803,
    "name": "I-103",
    "building": "I",
    "floor": 1,
    "capacity": 18,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 804,
    "name": "I-104",
    "building": "I",
    "floor": 1,
    "capacity": 40,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 805,
    "name": "I-105",
    "building": "I",
    "floor": 1,
    "capacity": 100,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 806,
    "name": "I-106",
    "building": "I",
    "floor": 1,
    "capacity": 20,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 807,
    "name": "I-107",
    "building": "I",
    "floor": 1,
    "capacity": 45,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 808,
    "name": "I-108",
    "building": "I",
    "floor": 1,
    "capacity": 120,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 809,
    "name": "I-109",
    "building": "I",
    "floor": 1,
    "capacity": 24,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 810,
    "name": "I-110",
    "building": "I",
    "floor": 1,
    "capacity": 50,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 811,
    "name": "I-111",
    "building": "I",
    "floor": 1,
    "capacity": 150,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 812,
    "name": "I-112",
    "building": "I",
    "floor": 1,
    "capacity": 25,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 813,
    "name": "I-113",
    "building": "I",
    "floor": 1,
    "capacity": 60,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 814,
    "name": "I-114",
    "building": "I",
    "floor": 1,
    "capacity": 12,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 815,
    "name": "I-115",
    "building": "I",
    "floor": 1,
    "capacity": 30,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 816,
    "name": "I-116",
    "building": "I",
    "floor": 1,
    "capacity": 75,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 817,
    "name": "I-117",
    "building": "I",
    "floor": 1,
    "capacity": 15,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 818,
    "name": "I-118",
    "building": "I",
    "floor": 1,
    "capacity": 35,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 819,
    "name": "I-119",
    "building": "I",
    "floor": 1,
    "capacity": 80,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 820,
    "name": "I-120",
    "building": "I",
    "floor": 1,
    "capacity": 18,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 821,
    "name": "I-121",
    "building": "I",
    "floor": 1,
    "capacity": 40,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 822,
    "name": "I-122",
    "building": "I",
    "floor": 1,
    "capacity": 100,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 823,
    "name": "I-123",
    "building": "I",
    "floor": 1,
    "capacity": 20,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 824,
    "name": "I-124",
    "building": "I",
    "floor": 1,
    "capacity": 45,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 825,
    "name": "I-125",
    "building": "I",
    "floor": 1,
    "capacity": 120,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 826,
    "name": "I-201",
    "building": "I",
    "floor": 2,
    "capacity": 35,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 827,
    "name": "I-202",
    "building": "I",
    "floor": 2,
    "capacity": 80,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 828,
    "name": "I-203",
    "building": "I",
    "floor": 2,
    "capacity": 18,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 829,
    "name": "I-204",
    "building": "I",
    "floor": 2,
    "capacity": 40,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 830,
    "name": "I-205",
    "building": "I",
    "floor": 2,
    "capacity": 100,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 831,
    "name": "I-206",
    "building": "I",
    "floor": 2,
    "capacity": 20,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 832,
    "name": "I-207",
    "building": "I",
    "floor": 2,
    "capacity": 45,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 833,
    "name": "I-208",
    "building": "I",
    "floor": 2,
    "capacity": 120,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 834,
    "name": "I-209",
    "building": "I",
    "floor": 2,
    "capacity": 24,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 835,
    "name": "I-210",
    "building": "I",
    "floor": 2,
    "capacity": 50,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 836,
    "name": "I-211",
    "building": "I",
    "floor": 2,
    "capacity": 150,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 837,
    "name": "I-212",
    "building": "I",
    "floor": 2,
    "capacity": 25,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 838,
    "name": "I-213",
    "building": "I",
    "floor": 2,
    "capacity": 60,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 839,
    "name": "I-214",
    "building": "I",
    "floor": 2,
    "capacity": 12,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 840,
    "name": "I-215",
    "building": "I",
    "floor": 2,
    "capacity": 30,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 841,
    "name": "I-216",
    "building": "I",
    "floor": 2,
    "capacity": 75,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 842,
    "name": "I-217",
    "building": "I",
    "floor": 2,
    "capacity": 15,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 843,
    "name": "I-218",
    "building": "I",
    "floor": 2,
    "capacity": 35,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 844,
    "name": "I-219",
    "building": "I",
    "floor": 2,
    "capacity": 80,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 845,
    "name": "I-220",
    "building": "I",
    "floor": 2,
    "capacity": 18,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 846,
    "name": "I-221",
    "building": "I",
    "floor": 2,
    "capacity": 40,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 847,
    "name": "I-222",
    "building": "I",
    "floor": 2,
    "capacity": 100,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 848,
    "name": "I-223",
    "building": "I",
    "floor": 2,
    "capacity": 20,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 849,
    "name": "I-224",
    "building": "I",
    "floor": 2,
    "capacity": 45,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 850,
    "name": "I-225",
    "building": "I",
    "floor": 2,
    "capacity": 120,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 851,
    "name": "I-301",
    "building": "I",
    "floor": 3,
    "capacity": 35,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 852,
    "name": "I-302",
    "building": "I",
    "floor": 3,
    "capacity": 80,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 853,
    "name": "I-303",
    "building": "I",
    "floor": 3,
    "capacity": 18,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 854,
    "name": "I-304",
    "building": "I",
    "floor": 3,
    "capacity": 40,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 855,
    "name": "I-305",
    "building": "I",
    "floor": 3,
    "capacity": 100,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 856,
    "name": "I-306",
    "building": "I",
    "floor": 3,
    "capacity": 20,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 857,
    "name": "I-307",
    "building": "I",
    "floor": 3,
    "capacity": 45,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 858,
    "name": "I-308",
    "building": "I",
    "floor": 3,
    "capacity": 120,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 859,
    "name": "I-309",
    "building": "I",
    "floor": 3,
    "capacity": 24,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 860,
    "name": "I-310",
    "building": "I",
    "floor": 3,
    "capacity": 50,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 861,
    "name": "I-311",
    "building": "I",
    "floor": 3,
    "capacity": 150,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 862,
    "name": "I-312",
    "building": "I",
    "floor": 3,
    "capacity": 25,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 863,
    "name": "I-313",
    "building": "I",
    "floor": 3,
    "capacity": 60,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 864,
    "name": "I-314",
    "building": "I",
    "floor": 3,
    "capacity": 12,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 865,
    "name": "I-315",
    "building": "I",
    "floor": 3,
    "capacity": 30,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 866,
    "name": "I-316",
    "building": "I",
    "floor": 3,
    "capacity": 75,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 867,
    "name": "I-317",
    "building": "I",
    "floor": 3,
    "capacity": 15,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 868,
    "name": "I-318",
    "building": "I",
    "floor": 3,
    "capacity": 35,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 869,
    "name": "I-319",
    "building": "I",
    "floor": 3,
    "capacity": 80,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 870,
    "name": "I-320",
    "building": "I",
    "floor": 3,
    "capacity": 18,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 871,
    "name": "I-321",
    "building": "I",
    "floor": 3,
    "capacity": 40,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 872,
    "name": "I-322",
    "building": "I",
    "floor": 3,
    "capacity": 100,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 873,
    "name": "I-323",
    "building": "I",
    "floor": 3,
    "capacity": 20,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 874,
    "name": "I-324",
    "building": "I",
    "floor": 3,
    "capacity": 45,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 875,
    "name": "I-325",
    "building": "I",
    "floor": 3,
    "capacity": 120,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 876,
    "name": "I-401",
    "building": "I",
    "floor": 4,
    "capacity": 35,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 877,
    "name": "I-402",
    "building": "I",
    "floor": 4,
    "capacity": 80,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 878,
    "name": "I-403",
    "building": "I",
    "floor": 4,
    "capacity": 18,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 879,
    "name": "I-404",
    "building": "I",
    "floor": 4,
    "capacity": 40,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 880,
    "name": "I-405",
    "building": "I",
    "floor": 4,
    "capacity": 100,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 881,
    "name": "I-406",
    "building": "I",
    "floor": 4,
    "capacity": 20,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 882,
    "name": "I-407",
    "building": "I",
    "floor": 4,
    "capacity": 45,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 883,
    "name": "I-408",
    "building": "I",
    "floor": 4,
    "capacity": 120,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 884,
    "name": "I-409",
    "building": "I",
    "floor": 4,
    "capacity": 24,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 885,
    "name": "I-410",
    "building": "I",
    "floor": 4,
    "capacity": 50,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 886,
    "name": "I-411",
    "building": "I",
    "floor": 4,
    "capacity": 150,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 887,
    "name": "I-412",
    "building": "I",
    "floor": 4,
    "capacity": 25,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 888,
    "name": "I-413",
    "building": "I",
    "floor": 4,
    "capacity": 60,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 889,
    "name": "I-414",
    "building": "I",
    "floor": 4,
    "capacity": 12,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 890,
    "name": "I-415",
    "building": "I",
    "floor": 4,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 891,
    "name": "I-416",
    "building": "I",
    "floor": 4,
    "capacity": 75,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 892,
    "name": "I-417",
    "building": "I",
    "floor": 4,
    "capacity": 15,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 893,
    "name": "I-418",
    "building": "I",
    "floor": 4,
    "capacity": 35,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 894,
    "name": "I-419",
    "building": "I",
    "floor": 4,
    "capacity": 80,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 895,
    "name": "I-420",
    "building": "I",
    "floor": 4,
    "capacity": 18,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 896,
    "name": "I-421",
    "building": "I",
    "floor": 4,
    "capacity": 40,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 897,
    "name": "I-422",
    "building": "I",
    "floor": 4,
    "capacity": 100,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 898,
    "name": "I-423",
    "building": "I",
    "floor": 4,
    "capacity": 20,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 899,
    "name": "I-424",
    "building": "I",
    "floor": 4,
    "capacity": 45,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 900,
    "name": "I-425",
    "building": "I",
    "floor": 4,
    "capacity": 120,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 901,
    "name": "J-101",
    "building": "J",
    "floor": 1,
    "capacity": 100,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 902,
    "name": "J-102",
    "building": "J",
    "floor": 1,
    "capacity": 20,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 903,
    "name": "J-103",
    "building": "J",
    "floor": 1,
    "capacity": 45,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 904,
    "name": "J-104",
    "building": "J",
    "floor": 1,
    "capacity": 120,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 905,
    "name": "J-105",
    "building": "J",
    "floor": 1,
    "capacity": 24,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 906,
    "name": "J-106",
    "building": "J",
    "floor": 1,
    "capacity": 50,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 907,
    "name": "J-107",
    "building": "J",
    "floor": 1,
    "capacity": 150,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 908,
    "name": "J-108",
    "building": "J",
    "floor": 1,
    "capacity": 25,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 909,
    "name": "J-109",
    "building": "J",
    "floor": 1,
    "capacity": 60,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 910,
    "name": "J-110",
    "building": "J",
    "floor": 1,
    "capacity": 12,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 911,
    "name": "J-111",
    "building": "J",
    "floor": 1,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 912,
    "name": "J-112",
    "building": "J",
    "floor": 1,
    "capacity": 75,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 913,
    "name": "J-113",
    "building": "J",
    "floor": 1,
    "capacity": 15,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 914,
    "name": "J-114",
    "building": "J",
    "floor": 1,
    "capacity": 35,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 915,
    "name": "J-115",
    "building": "J",
    "floor": 1,
    "capacity": 80,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 916,
    "name": "J-116",
    "building": "J",
    "floor": 1,
    "capacity": 18,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 917,
    "name": "J-117",
    "building": "J",
    "floor": 1,
    "capacity": 40,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 918,
    "name": "J-118",
    "building": "J",
    "floor": 1,
    "capacity": 100,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 919,
    "name": "J-119",
    "building": "J",
    "floor": 1,
    "capacity": 20,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 920,
    "name": "J-120",
    "building": "J",
    "floor": 1,
    "capacity": 45,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 921,
    "name": "J-121",
    "building": "J",
    "floor": 1,
    "capacity": 120,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 922,
    "name": "J-122",
    "building": "J",
    "floor": 1,
    "capacity": 24,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 923,
    "name": "J-123",
    "building": "J",
    "floor": 1,
    "capacity": 50,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 924,
    "name": "J-124",
    "building": "J",
    "floor": 1,
    "capacity": 150,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 925,
    "name": "J-125",
    "building": "J",
    "floor": 1,
    "capacity": 25,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 926,
    "name": "J-201",
    "building": "J",
    "floor": 2,
    "capacity": 100,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 927,
    "name": "J-202",
    "building": "J",
    "floor": 2,
    "capacity": 20,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 928,
    "name": "J-203",
    "building": "J",
    "floor": 2,
    "capacity": 45,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 929,
    "name": "J-204",
    "building": "J",
    "floor": 2,
    "capacity": 120,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 930,
    "name": "J-205",
    "building": "J",
    "floor": 2,
    "capacity": 24,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 931,
    "name": "J-206",
    "building": "J",
    "floor": 2,
    "capacity": 50,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 932,
    "name": "J-207",
    "building": "J",
    "floor": 2,
    "capacity": 150,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 933,
    "name": "J-208",
    "building": "J",
    "floor": 2,
    "capacity": 25,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 934,
    "name": "J-209",
    "building": "J",
    "floor": 2,
    "capacity": 60,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 935,
    "name": "J-210",
    "building": "J",
    "floor": 2,
    "capacity": 12,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 936,
    "name": "J-211",
    "building": "J",
    "floor": 2,
    "capacity": 30,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 937,
    "name": "J-212",
    "building": "J",
    "floor": 2,
    "capacity": 75,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 938,
    "name": "J-213",
    "building": "J",
    "floor": 2,
    "capacity": 15,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 939,
    "name": "J-214",
    "building": "J",
    "floor": 2,
    "capacity": 35,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 940,
    "name": "J-215",
    "building": "J",
    "floor": 2,
    "capacity": 80,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 941,
    "name": "J-216",
    "building": "J",
    "floor": 2,
    "capacity": 18,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 942,
    "name": "J-217",
    "building": "J",
    "floor": 2,
    "capacity": 40,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 943,
    "name": "J-218",
    "building": "J",
    "floor": 2,
    "capacity": 100,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 944,
    "name": "J-219",
    "building": "J",
    "floor": 2,
    "capacity": 20,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 945,
    "name": "J-220",
    "building": "J",
    "floor": 2,
    "capacity": 45,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 946,
    "name": "J-221",
    "building": "J",
    "floor": 2,
    "capacity": 120,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 947,
    "name": "J-222",
    "building": "J",
    "floor": 2,
    "capacity": 24,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 948,
    "name": "J-223",
    "building": "J",
    "floor": 2,
    "capacity": 50,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 949,
    "name": "J-224",
    "building": "J",
    "floor": 2,
    "capacity": 150,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 950,
    "name": "J-225",
    "building": "J",
    "floor": 2,
    "capacity": 25,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 951,
    "name": "J-301",
    "building": "J",
    "floor": 3,
    "capacity": 100,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 952,
    "name": "J-302",
    "building": "J",
    "floor": 3,
    "capacity": 20,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 953,
    "name": "J-303",
    "building": "J",
    "floor": 3,
    "capacity": 45,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 954,
    "name": "J-304",
    "building": "J",
    "floor": 3,
    "capacity": 120,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 955,
    "name": "J-305",
    "building": "J",
    "floor": 3,
    "capacity": 24,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 956,
    "name": "J-306",
    "building": "J",
    "floor": 3,
    "capacity": 50,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 957,
    "name": "J-307",
    "building": "J",
    "floor": 3,
    "capacity": 150,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 958,
    "name": "J-308",
    "building": "J",
    "floor": 3,
    "capacity": 25,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 959,
    "name": "J-309",
    "building": "J",
    "floor": 3,
    "capacity": 60,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 960,
    "name": "J-310",
    "building": "J",
    "floor": 3,
    "capacity": 12,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 961,
    "name": "J-311",
    "building": "J",
    "floor": 3,
    "capacity": 30,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 962,
    "name": "J-312",
    "building": "J",
    "floor": 3,
    "capacity": 75,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 963,
    "name": "J-313",
    "building": "J",
    "floor": 3,
    "capacity": 15,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 964,
    "name": "J-314",
    "building": "J",
    "floor": 3,
    "capacity": 35,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 965,
    "name": "J-315",
    "building": "J",
    "floor": 3,
    "capacity": 80,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 966,
    "name": "J-316",
    "building": "J",
    "floor": 3,
    "capacity": 18,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 967,
    "name": "J-317",
    "building": "J",
    "floor": 3,
    "capacity": 40,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 968,
    "name": "J-318",
    "building": "J",
    "floor": 3,
    "capacity": 100,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 969,
    "name": "J-319",
    "building": "J",
    "floor": 3,
    "capacity": 20,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 970,
    "name": "J-320",
    "building": "J",
    "floor": 3,
    "capacity": 45,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 971,
    "name": "J-321",
    "building": "J",
    "floor": 3,
    "capacity": 120,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 972,
    "name": "J-322",
    "building": "J",
    "floor": 3,
    "capacity": 24,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 973,
    "name": "J-323",
    "building": "J",
    "floor": 3,
    "capacity": 50,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 974,
    "name": "J-324",
    "building": "J",
    "floor": 3,
    "capacity": 150,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 975,
    "name": "J-325",
    "building": "J",
    "floor": 3,
    "capacity": 25,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 976,
    "name": "J-401",
    "building": "J",
    "floor": 4,
    "capacity": 100,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 977,
    "name": "J-402",
    "building": "J",
    "floor": 4,
    "capacity": 20,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 978,
    "name": "J-403",
    "building": "J",
    "floor": 4,
    "capacity": 45,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 979,
    "name": "J-404",
    "building": "J",
    "floor": 4,
    "capacity": 120,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 980,
    "name": "J-405",
    "building": "J",
    "floor": 4,
    "capacity": 24,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 981,
    "name": "J-406",
    "building": "J",
    "floor": 4,
    "capacity": 50,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 982,
    "name": "J-407",
    "building": "J",
    "floor": 4,
    "capacity": 150,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 983,
    "name": "J-408",
    "building": "J",
    "floor": 4,
    "capacity": 25,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 984,
    "name": "J-409",
    "building": "J",
    "floor": 4,
    "capacity": 60,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 985,
    "name": "J-410",
    "building": "J",
    "floor": 4,
    "capacity": 12,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 986,
    "name": "J-411",
    "building": "J",
    "floor": 4,
    "capacity": 30,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 987,
    "name": "J-412",
    "building": "J",
    "floor": 4,
    "capacity": 75,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 988,
    "name": "J-413",
    "building": "J",
    "floor": 4,
    "capacity": 15,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 989,
    "name": "J-414",
    "building": "J",
    "floor": 4,
    "capacity": 35,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 990,
    "name": "J-415",
    "building": "J",
    "floor": 4,
    "capacity": 80,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 991,
    "name": "J-416",
    "building": "J",
    "floor": 4,
    "capacity": 18,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 992,
    "name": "J-417",
    "building": "J",
    "floor": 4,
    "capacity": 40,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 993,
    "name": "J-418",
    "building": "J",
    "floor": 4,
    "capacity": 100,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 994,
    "name": "J-419",
    "building": "J",
    "floor": 4,
    "capacity": 20,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 995,
    "name": "J-420",
    "building": "J",
    "floor": 4,
    "capacity": 45,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 996,
    "name": "J-421",
    "building": "J",
    "floor": 4,
    "capacity": 120,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 997,
    "name": "J-422",
    "building": "J",
    "floor": 4,
    "capacity": 24,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 998,
    "name": "J-423",
    "building": "J",
    "floor": 4,
    "capacity": 50,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 999,
    "name": "J-424",
    "building": "J",
    "floor": 4,
    "capacity": 150,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1000,
    "name": "J-425",
    "building": "J",
    "floor": 4,
    "capacity": 25,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1001,
    "name": "K-101",
    "building": "K",
    "floor": 1,
    "capacity": 24,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1002,
    "name": "K-102",
    "building": "K",
    "floor": 1,
    "capacity": 50,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1003,
    "name": "K-103",
    "building": "K",
    "floor": 1,
    "capacity": 150,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1004,
    "name": "K-104",
    "building": "K",
    "floor": 1,
    "capacity": 25,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1005,
    "name": "K-105",
    "building": "K",
    "floor": 1,
    "capacity": 60,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1006,
    "name": "K-106",
    "building": "K",
    "floor": 1,
    "capacity": 12,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1007,
    "name": "K-107",
    "building": "K",
    "floor": 1,
    "capacity": 30,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1008,
    "name": "K-108",
    "building": "K",
    "floor": 1,
    "capacity": 75,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1009,
    "name": "K-109",
    "building": "K",
    "floor": 1,
    "capacity": 15,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1010,
    "name": "K-110",
    "building": "K",
    "floor": 1,
    "capacity": 35,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1011,
    "name": "K-111",
    "building": "K",
    "floor": 1,
    "capacity": 80,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1012,
    "name": "K-112",
    "building": "K",
    "floor": 1,
    "capacity": 18,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1013,
    "name": "K-113",
    "building": "K",
    "floor": 1,
    "capacity": 40,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1014,
    "name": "K-114",
    "building": "K",
    "floor": 1,
    "capacity": 100,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1015,
    "name": "K-115",
    "building": "K",
    "floor": 1,
    "capacity": 20,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1016,
    "name": "K-116",
    "building": "K",
    "floor": 1,
    "capacity": 45,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1017,
    "name": "K-117",
    "building": "K",
    "floor": 1,
    "capacity": 120,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1018,
    "name": "K-118",
    "building": "K",
    "floor": 1,
    "capacity": 24,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1019,
    "name": "K-119",
    "building": "K",
    "floor": 1,
    "capacity": 50,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1020,
    "name": "K-120",
    "building": "K",
    "floor": 1,
    "capacity": 150,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1021,
    "name": "K-121",
    "building": "K",
    "floor": 1,
    "capacity": 25,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1022,
    "name": "K-122",
    "building": "K",
    "floor": 1,
    "capacity": 60,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1023,
    "name": "K-123",
    "building": "K",
    "floor": 1,
    "capacity": 12,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1024,
    "name": "K-124",
    "building": "K",
    "floor": 1,
    "capacity": 30,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1025,
    "name": "K-125",
    "building": "K",
    "floor": 1,
    "capacity": 75,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1026,
    "name": "K-201",
    "building": "K",
    "floor": 2,
    "capacity": 24,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1027,
    "name": "K-202",
    "building": "K",
    "floor": 2,
    "capacity": 50,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1028,
    "name": "K-203",
    "building": "K",
    "floor": 2,
    "capacity": 150,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1029,
    "name": "K-204",
    "building": "K",
    "floor": 2,
    "capacity": 25,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1030,
    "name": "K-205",
    "building": "K",
    "floor": 2,
    "capacity": 60,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1031,
    "name": "K-206",
    "building": "K",
    "floor": 2,
    "capacity": 12,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1032,
    "name": "K-207",
    "building": "K",
    "floor": 2,
    "capacity": 30,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1033,
    "name": "K-208",
    "building": "K",
    "floor": 2,
    "capacity": 75,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1034,
    "name": "K-209",
    "building": "K",
    "floor": 2,
    "capacity": 15,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1035,
    "name": "K-210",
    "building": "K",
    "floor": 2,
    "capacity": 35,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1036,
    "name": "K-211",
    "building": "K",
    "floor": 2,
    "capacity": 80,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1037,
    "name": "K-212",
    "building": "K",
    "floor": 2,
    "capacity": 18,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1038,
    "name": "K-213",
    "building": "K",
    "floor": 2,
    "capacity": 40,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1039,
    "name": "K-214",
    "building": "K",
    "floor": 2,
    "capacity": 100,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1040,
    "name": "K-215",
    "building": "K",
    "floor": 2,
    "capacity": 20,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1041,
    "name": "K-216",
    "building": "K",
    "floor": 2,
    "capacity": 45,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1042,
    "name": "K-217",
    "building": "K",
    "floor": 2,
    "capacity": 120,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1043,
    "name": "K-218",
    "building": "K",
    "floor": 2,
    "capacity": 24,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1044,
    "name": "K-219",
    "building": "K",
    "floor": 2,
    "capacity": 50,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1045,
    "name": "K-220",
    "building": "K",
    "floor": 2,
    "capacity": 150,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1046,
    "name": "K-221",
    "building": "K",
    "floor": 2,
    "capacity": 25,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1047,
    "name": "K-222",
    "building": "K",
    "floor": 2,
    "capacity": 60,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1048,
    "name": "K-223",
    "building": "K",
    "floor": 2,
    "capacity": 12,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1049,
    "name": "K-224",
    "building": "K",
    "floor": 2,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1050,
    "name": "K-225",
    "building": "K",
    "floor": 2,
    "capacity": 75,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1051,
    "name": "K-301",
    "building": "K",
    "floor": 3,
    "capacity": 24,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1052,
    "name": "K-302",
    "building": "K",
    "floor": 3,
    "capacity": 50,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1053,
    "name": "K-303",
    "building": "K",
    "floor": 3,
    "capacity": 150,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1054,
    "name": "K-304",
    "building": "K",
    "floor": 3,
    "capacity": 25,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1055,
    "name": "K-305",
    "building": "K",
    "floor": 3,
    "capacity": 60,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1056,
    "name": "K-306",
    "building": "K",
    "floor": 3,
    "capacity": 12,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1057,
    "name": "K-307",
    "building": "K",
    "floor": 3,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1058,
    "name": "K-308",
    "building": "K",
    "floor": 3,
    "capacity": 75,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1059,
    "name": "K-309",
    "building": "K",
    "floor": 3,
    "capacity": 15,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1060,
    "name": "K-310",
    "building": "K",
    "floor": 3,
    "capacity": 35,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1061,
    "name": "K-311",
    "building": "K",
    "floor": 3,
    "capacity": 80,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1062,
    "name": "K-312",
    "building": "K",
    "floor": 3,
    "capacity": 18,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1063,
    "name": "K-313",
    "building": "K",
    "floor": 3,
    "capacity": 40,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1064,
    "name": "K-314",
    "building": "K",
    "floor": 3,
    "capacity": 100,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1065,
    "name": "K-315",
    "building": "K",
    "floor": 3,
    "capacity": 20,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1066,
    "name": "K-316",
    "building": "K",
    "floor": 3,
    "capacity": 45,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1067,
    "name": "K-317",
    "building": "K",
    "floor": 3,
    "capacity": 120,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1068,
    "name": "K-318",
    "building": "K",
    "floor": 3,
    "capacity": 24,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1069,
    "name": "K-319",
    "building": "K",
    "floor": 3,
    "capacity": 50,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1070,
    "name": "K-320",
    "building": "K",
    "floor": 3,
    "capacity": 150,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1071,
    "name": "K-321",
    "building": "K",
    "floor": 3,
    "capacity": 25,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1072,
    "name": "K-322",
    "building": "K",
    "floor": 3,
    "capacity": 60,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1073,
    "name": "K-323",
    "building": "K",
    "floor": 3,
    "capacity": 12,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1074,
    "name": "K-324",
    "building": "K",
    "floor": 3,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1075,
    "name": "K-325",
    "building": "K",
    "floor": 3,
    "capacity": 75,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1076,
    "name": "K-401",
    "building": "K",
    "floor": 4,
    "capacity": 24,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1077,
    "name": "K-402",
    "building": "K",
    "floor": 4,
    "capacity": 50,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1078,
    "name": "K-403",
    "building": "K",
    "floor": 4,
    "capacity": 150,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1079,
    "name": "K-404",
    "building": "K",
    "floor": 4,
    "capacity": 25,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1080,
    "name": "K-405",
    "building": "K",
    "floor": 4,
    "capacity": 60,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1081,
    "name": "K-406",
    "building": "K",
    "floor": 4,
    "capacity": 12,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1082,
    "name": "K-407",
    "building": "K",
    "floor": 4,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1083,
    "name": "K-408",
    "building": "K",
    "floor": 4,
    "capacity": 75,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1084,
    "name": "K-409",
    "building": "K",
    "floor": 4,
    "capacity": 15,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1085,
    "name": "K-410",
    "building": "K",
    "floor": 4,
    "capacity": 35,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1086,
    "name": "K-411",
    "building": "K",
    "floor": 4,
    "capacity": 80,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1087,
    "name": "K-412",
    "building": "K",
    "floor": 4,
    "capacity": 18,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1088,
    "name": "K-413",
    "building": "K",
    "floor": 4,
    "capacity": 40,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1089,
    "name": "K-414",
    "building": "K",
    "floor": 4,
    "capacity": 100,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1090,
    "name": "K-415",
    "building": "K",
    "floor": 4,
    "capacity": 20,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1091,
    "name": "K-416",
    "building": "K",
    "floor": 4,
    "capacity": 45,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1092,
    "name": "K-417",
    "building": "K",
    "floor": 4,
    "capacity": 120,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1093,
    "name": "K-418",
    "building": "K",
    "floor": 4,
    "capacity": 24,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1094,
    "name": "K-419",
    "building": "K",
    "floor": 4,
    "capacity": 50,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1095,
    "name": "K-420",
    "building": "K",
    "floor": 4,
    "capacity": 150,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1096,
    "name": "K-421",
    "building": "K",
    "floor": 4,
    "capacity": 25,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1097,
    "name": "K-422",
    "building": "K",
    "floor": 4,
    "capacity": 60,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1098,
    "name": "K-423",
    "building": "K",
    "floor": 4,
    "capacity": 12,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1099,
    "name": "K-424",
    "building": "K",
    "floor": 4,
    "capacity": 30,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1100,
    "name": "K-425",
    "building": "K",
    "floor": 4,
    "capacity": 75,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1101,
    "name": "L-101",
    "building": "L",
    "floor": 1,
    "capacity": 60,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1102,
    "name": "L-102",
    "building": "L",
    "floor": 1,
    "capacity": 12,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1103,
    "name": "L-103",
    "building": "L",
    "floor": 1,
    "capacity": 30,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1104,
    "name": "L-104",
    "building": "L",
    "floor": 1,
    "capacity": 75,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1105,
    "name": "L-105",
    "building": "L",
    "floor": 1,
    "capacity": 15,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1106,
    "name": "L-106",
    "building": "L",
    "floor": 1,
    "capacity": 35,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1107,
    "name": "L-107",
    "building": "L",
    "floor": 1,
    "capacity": 80,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1108,
    "name": "L-108",
    "building": "L",
    "floor": 1,
    "capacity": 18,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1109,
    "name": "L-109",
    "building": "L",
    "floor": 1,
    "capacity": 40,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1110,
    "name": "L-110",
    "building": "L",
    "floor": 1,
    "capacity": 100,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1111,
    "name": "L-111",
    "building": "L",
    "floor": 1,
    "capacity": 20,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1112,
    "name": "L-112",
    "building": "L",
    "floor": 1,
    "capacity": 45,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1113,
    "name": "L-113",
    "building": "L",
    "floor": 1,
    "capacity": 120,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1114,
    "name": "L-114",
    "building": "L",
    "floor": 1,
    "capacity": 24,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1115,
    "name": "L-115",
    "building": "L",
    "floor": 1,
    "capacity": 50,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1116,
    "name": "L-116",
    "building": "L",
    "floor": 1,
    "capacity": 150,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1117,
    "name": "L-117",
    "building": "L",
    "floor": 1,
    "capacity": 25,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1118,
    "name": "L-118",
    "building": "L",
    "floor": 1,
    "capacity": 60,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1119,
    "name": "L-119",
    "building": "L",
    "floor": 1,
    "capacity": 12,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1120,
    "name": "L-120",
    "building": "L",
    "floor": 1,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1121,
    "name": "L-121",
    "building": "L",
    "floor": 1,
    "capacity": 75,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1122,
    "name": "L-122",
    "building": "L",
    "floor": 1,
    "capacity": 15,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1123,
    "name": "L-123",
    "building": "L",
    "floor": 1,
    "capacity": 35,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1124,
    "name": "L-124",
    "building": "L",
    "floor": 1,
    "capacity": 80,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1125,
    "name": "L-125",
    "building": "L",
    "floor": 1,
    "capacity": 18,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1126,
    "name": "L-201",
    "building": "L",
    "floor": 2,
    "capacity": 60,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1127,
    "name": "L-202",
    "building": "L",
    "floor": 2,
    "capacity": 12,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1128,
    "name": "L-203",
    "building": "L",
    "floor": 2,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1129,
    "name": "L-204",
    "building": "L",
    "floor": 2,
    "capacity": 75,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1130,
    "name": "L-205",
    "building": "L",
    "floor": 2,
    "capacity": 15,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1131,
    "name": "L-206",
    "building": "L",
    "floor": 2,
    "capacity": 35,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1132,
    "name": "L-207",
    "building": "L",
    "floor": 2,
    "capacity": 80,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1133,
    "name": "L-208",
    "building": "L",
    "floor": 2,
    "capacity": 18,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1134,
    "name": "L-209",
    "building": "L",
    "floor": 2,
    "capacity": 40,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1135,
    "name": "L-210",
    "building": "L",
    "floor": 2,
    "capacity": 100,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1136,
    "name": "L-211",
    "building": "L",
    "floor": 2,
    "capacity": 20,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1137,
    "name": "L-212",
    "building": "L",
    "floor": 2,
    "capacity": 45,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1138,
    "name": "L-213",
    "building": "L",
    "floor": 2,
    "capacity": 120,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1139,
    "name": "L-214",
    "building": "L",
    "floor": 2,
    "capacity": 24,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1140,
    "name": "L-215",
    "building": "L",
    "floor": 2,
    "capacity": 50,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1141,
    "name": "L-216",
    "building": "L",
    "floor": 2,
    "capacity": 150,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1142,
    "name": "L-217",
    "building": "L",
    "floor": 2,
    "capacity": 25,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1143,
    "name": "L-218",
    "building": "L",
    "floor": 2,
    "capacity": 60,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1144,
    "name": "L-219",
    "building": "L",
    "floor": 2,
    "capacity": 12,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1145,
    "name": "L-220",
    "building": "L",
    "floor": 2,
    "capacity": 30,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1146,
    "name": "L-221",
    "building": "L",
    "floor": 2,
    "capacity": 75,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1147,
    "name": "L-222",
    "building": "L",
    "floor": 2,
    "capacity": 15,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1148,
    "name": "L-223",
    "building": "L",
    "floor": 2,
    "capacity": 35,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1149,
    "name": "L-224",
    "building": "L",
    "floor": 2,
    "capacity": 80,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1150,
    "name": "L-225",
    "building": "L",
    "floor": 2,
    "capacity": 18,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1151,
    "name": "L-301",
    "building": "L",
    "floor": 3,
    "capacity": 60,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1152,
    "name": "L-302",
    "building": "L",
    "floor": 3,
    "capacity": 12,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1153,
    "name": "L-303",
    "building": "L",
    "floor": 3,
    "capacity": 30,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1154,
    "name": "L-304",
    "building": "L",
    "floor": 3,
    "capacity": 75,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1155,
    "name": "L-305",
    "building": "L",
    "floor": 3,
    "capacity": 15,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1156,
    "name": "L-306",
    "building": "L",
    "floor": 3,
    "capacity": 35,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1157,
    "name": "L-307",
    "building": "L",
    "floor": 3,
    "capacity": 80,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1158,
    "name": "L-308",
    "building": "L",
    "floor": 3,
    "capacity": 18,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1159,
    "name": "L-309",
    "building": "L",
    "floor": 3,
    "capacity": 40,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1160,
    "name": "L-310",
    "building": "L",
    "floor": 3,
    "capacity": 100,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1161,
    "name": "L-311",
    "building": "L",
    "floor": 3,
    "capacity": 20,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1162,
    "name": "L-312",
    "building": "L",
    "floor": 3,
    "capacity": 45,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1163,
    "name": "L-313",
    "building": "L",
    "floor": 3,
    "capacity": 120,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1164,
    "name": "L-314",
    "building": "L",
    "floor": 3,
    "capacity": 24,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1165,
    "name": "L-315",
    "building": "L",
    "floor": 3,
    "capacity": 50,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1166,
    "name": "L-316",
    "building": "L",
    "floor": 3,
    "capacity": 150,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1167,
    "name": "L-317",
    "building": "L",
    "floor": 3,
    "capacity": 25,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1168,
    "name": "L-318",
    "building": "L",
    "floor": 3,
    "capacity": 60,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1169,
    "name": "L-319",
    "building": "L",
    "floor": 3,
    "capacity": 12,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1170,
    "name": "L-320",
    "building": "L",
    "floor": 3,
    "capacity": 30,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1171,
    "name": "L-321",
    "building": "L",
    "floor": 3,
    "capacity": 75,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1172,
    "name": "L-322",
    "building": "L",
    "floor": 3,
    "capacity": 15,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1173,
    "name": "L-323",
    "building": "L",
    "floor": 3,
    "capacity": 35,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1174,
    "name": "L-324",
    "building": "L",
    "floor": 3,
    "capacity": 80,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1175,
    "name": "L-325",
    "building": "L",
    "floor": 3,
    "capacity": 18,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1176,
    "name": "L-401",
    "building": "L",
    "floor": 4,
    "capacity": 60,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1177,
    "name": "L-402",
    "building": "L",
    "floor": 4,
    "capacity": 12,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1178,
    "name": "L-403",
    "building": "L",
    "floor": 4,
    "capacity": 30,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1179,
    "name": "L-404",
    "building": "L",
    "floor": 4,
    "capacity": 75,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1180,
    "name": "L-405",
    "building": "L",
    "floor": 4,
    "capacity": 15,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1181,
    "name": "L-406",
    "building": "L",
    "floor": 4,
    "capacity": 35,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1182,
    "name": "L-407",
    "building": "L",
    "floor": 4,
    "capacity": 80,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1183,
    "name": "L-408",
    "building": "L",
    "floor": 4,
    "capacity": 18,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1184,
    "name": "L-409",
    "building": "L",
    "floor": 4,
    "capacity": 40,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1185,
    "name": "L-410",
    "building": "L",
    "floor": 4,
    "capacity": 100,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1186,
    "name": "L-411",
    "building": "L",
    "floor": 4,
    "capacity": 20,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1187,
    "name": "L-412",
    "building": "L",
    "floor": 4,
    "capacity": 45,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1188,
    "name": "L-413",
    "building": "L",
    "floor": 4,
    "capacity": 120,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1189,
    "name": "L-414",
    "building": "L",
    "floor": 4,
    "capacity": 24,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1190,
    "name": "L-415",
    "building": "L",
    "floor": 4,
    "capacity": 50,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1191,
    "name": "L-416",
    "building": "L",
    "floor": 4,
    "capacity": 150,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1192,
    "name": "L-417",
    "building": "L",
    "floor": 4,
    "capacity": 25,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1193,
    "name": "L-418",
    "building": "L",
    "floor": 4,
    "capacity": 60,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1194,
    "name": "L-419",
    "building": "L",
    "floor": 4,
    "capacity": 12,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1195,
    "name": "L-420",
    "building": "L",
    "floor": 4,
    "capacity": 30,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1196,
    "name": "L-421",
    "building": "L",
    "floor": 4,
    "capacity": 75,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1197,
    "name": "L-422",
    "building": "L",
    "floor": 4,
    "capacity": 15,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1198,
    "name": "L-423",
    "building": "L",
    "floor": 4,
    "capacity": 35,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1199,
    "name": "L-424",
    "building": "L",
    "floor": 4,
    "capacity": 80,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1200,
    "name": "L-425",
    "building": "L",
    "floor": 4,
    "capacity": 18,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1201,
    "name": "M-101",
    "building": "M",
    "floor": 1,
    "capacity": 15,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1202,
    "name": "M-102",
    "building": "M",
    "floor": 1,
    "capacity": 35,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1203,
    "name": "M-103",
    "building": "M",
    "floor": 1,
    "capacity": 80,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1204,
    "name": "M-104",
    "building": "M",
    "floor": 1,
    "capacity": 18,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1205,
    "name": "M-105",
    "building": "M",
    "floor": 1,
    "capacity": 40,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1206,
    "name": "M-106",
    "building": "M",
    "floor": 1,
    "capacity": 100,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1207,
    "name": "M-107",
    "building": "M",
    "floor": 1,
    "capacity": 20,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1208,
    "name": "M-108",
    "building": "M",
    "floor": 1,
    "capacity": 45,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1209,
    "name": "M-109",
    "building": "M",
    "floor": 1,
    "capacity": 120,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1210,
    "name": "M-110",
    "building": "M",
    "floor": 1,
    "capacity": 24,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1211,
    "name": "M-111",
    "building": "M",
    "floor": 1,
    "capacity": 50,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1212,
    "name": "M-112",
    "building": "M",
    "floor": 1,
    "capacity": 150,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1213,
    "name": "M-113",
    "building": "M",
    "floor": 1,
    "capacity": 25,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1214,
    "name": "M-114",
    "building": "M",
    "floor": 1,
    "capacity": 60,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1215,
    "name": "M-115",
    "building": "M",
    "floor": 1,
    "capacity": 12,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1216,
    "name": "M-116",
    "building": "M",
    "floor": 1,
    "capacity": 30,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1217,
    "name": "M-117",
    "building": "M",
    "floor": 1,
    "capacity": 75,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1218,
    "name": "M-118",
    "building": "M",
    "floor": 1,
    "capacity": 15,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1219,
    "name": "M-119",
    "building": "M",
    "floor": 1,
    "capacity": 35,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1220,
    "name": "M-120",
    "building": "M",
    "floor": 1,
    "capacity": 80,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1221,
    "name": "M-121",
    "building": "M",
    "floor": 1,
    "capacity": 18,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1222,
    "name": "M-122",
    "building": "M",
    "floor": 1,
    "capacity": 40,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1223,
    "name": "M-123",
    "building": "M",
    "floor": 1,
    "capacity": 100,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1224,
    "name": "M-124",
    "building": "M",
    "floor": 1,
    "capacity": 20,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1225,
    "name": "M-125",
    "building": "M",
    "floor": 1,
    "capacity": 45,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1226,
    "name": "M-201",
    "building": "M",
    "floor": 2,
    "capacity": 15,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1227,
    "name": "M-202",
    "building": "M",
    "floor": 2,
    "capacity": 35,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1228,
    "name": "M-203",
    "building": "M",
    "floor": 2,
    "capacity": 80,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1229,
    "name": "M-204",
    "building": "M",
    "floor": 2,
    "capacity": 18,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1230,
    "name": "M-205",
    "building": "M",
    "floor": 2,
    "capacity": 40,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1231,
    "name": "M-206",
    "building": "M",
    "floor": 2,
    "capacity": 100,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1232,
    "name": "M-207",
    "building": "M",
    "floor": 2,
    "capacity": 20,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1233,
    "name": "M-208",
    "building": "M",
    "floor": 2,
    "capacity": 45,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1234,
    "name": "M-209",
    "building": "M",
    "floor": 2,
    "capacity": 120,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1235,
    "name": "M-210",
    "building": "M",
    "floor": 2,
    "capacity": 24,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1236,
    "name": "M-211",
    "building": "M",
    "floor": 2,
    "capacity": 50,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1237,
    "name": "M-212",
    "building": "M",
    "floor": 2,
    "capacity": 150,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1238,
    "name": "M-213",
    "building": "M",
    "floor": 2,
    "capacity": 25,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1239,
    "name": "M-214",
    "building": "M",
    "floor": 2,
    "capacity": 60,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1240,
    "name": "M-215",
    "building": "M",
    "floor": 2,
    "capacity": 12,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1241,
    "name": "M-216",
    "building": "M",
    "floor": 2,
    "capacity": 30,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1242,
    "name": "M-217",
    "building": "M",
    "floor": 2,
    "capacity": 75,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1243,
    "name": "M-218",
    "building": "M",
    "floor": 2,
    "capacity": 15,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1244,
    "name": "M-219",
    "building": "M",
    "floor": 2,
    "capacity": 35,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1245,
    "name": "M-220",
    "building": "M",
    "floor": 2,
    "capacity": 80,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1246,
    "name": "M-221",
    "building": "M",
    "floor": 2,
    "capacity": 18,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1247,
    "name": "M-222",
    "building": "M",
    "floor": 2,
    "capacity": 40,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1248,
    "name": "M-223",
    "building": "M",
    "floor": 2,
    "capacity": 100,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1249,
    "name": "M-224",
    "building": "M",
    "floor": 2,
    "capacity": 20,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1250,
    "name": "M-225",
    "building": "M",
    "floor": 2,
    "capacity": 45,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1251,
    "name": "M-301",
    "building": "M",
    "floor": 3,
    "capacity": 15,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1252,
    "name": "M-302",
    "building": "M",
    "floor": 3,
    "capacity": 35,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1253,
    "name": "M-303",
    "building": "M",
    "floor": 3,
    "capacity": 80,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1254,
    "name": "M-304",
    "building": "M",
    "floor": 3,
    "capacity": 18,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1255,
    "name": "M-305",
    "building": "M",
    "floor": 3,
    "capacity": 40,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1256,
    "name": "M-306",
    "building": "M",
    "floor": 3,
    "capacity": 100,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1257,
    "name": "M-307",
    "building": "M",
    "floor": 3,
    "capacity": 20,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1258,
    "name": "M-308",
    "building": "M",
    "floor": 3,
    "capacity": 45,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1259,
    "name": "M-309",
    "building": "M",
    "floor": 3,
    "capacity": 120,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1260,
    "name": "M-310",
    "building": "M",
    "floor": 3,
    "capacity": 24,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1261,
    "name": "M-311",
    "building": "M",
    "floor": 3,
    "capacity": 50,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1262,
    "name": "M-312",
    "building": "M",
    "floor": 3,
    "capacity": 150,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1263,
    "name": "M-313",
    "building": "M",
    "floor": 3,
    "capacity": 25,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1264,
    "name": "M-314",
    "building": "M",
    "floor": 3,
    "capacity": 60,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1265,
    "name": "M-315",
    "building": "M",
    "floor": 3,
    "capacity": 12,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1266,
    "name": "M-316",
    "building": "M",
    "floor": 3,
    "capacity": 30,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1267,
    "name": "M-317",
    "building": "M",
    "floor": 3,
    "capacity": 75,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1268,
    "name": "M-318",
    "building": "M",
    "floor": 3,
    "capacity": 15,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1269,
    "name": "M-319",
    "building": "M",
    "floor": 3,
    "capacity": 35,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1270,
    "name": "M-320",
    "building": "M",
    "floor": 3,
    "capacity": 80,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1271,
    "name": "M-321",
    "building": "M",
    "floor": 3,
    "capacity": 18,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1272,
    "name": "M-322",
    "building": "M",
    "floor": 3,
    "capacity": 40,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1273,
    "name": "M-323",
    "building": "M",
    "floor": 3,
    "capacity": 100,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1274,
    "name": "M-324",
    "building": "M",
    "floor": 3,
    "capacity": 20,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1275,
    "name": "M-325",
    "building": "M",
    "floor": 3,
    "capacity": 45,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1276,
    "name": "M-401",
    "building": "M",
    "floor": 4,
    "capacity": 15,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1277,
    "name": "M-402",
    "building": "M",
    "floor": 4,
    "capacity": 35,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1278,
    "name": "M-403",
    "building": "M",
    "floor": 4,
    "capacity": 80,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1279,
    "name": "M-404",
    "building": "M",
    "floor": 4,
    "capacity": 18,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1280,
    "name": "M-405",
    "building": "M",
    "floor": 4,
    "capacity": 40,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1281,
    "name": "M-406",
    "building": "M",
    "floor": 4,
    "capacity": 100,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1282,
    "name": "M-407",
    "building": "M",
    "floor": 4,
    "capacity": 20,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1283,
    "name": "M-408",
    "building": "M",
    "floor": 4,
    "capacity": 45,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1284,
    "name": "M-409",
    "building": "M",
    "floor": 4,
    "capacity": 120,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1285,
    "name": "M-410",
    "building": "M",
    "floor": 4,
    "capacity": 24,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1286,
    "name": "M-411",
    "building": "M",
    "floor": 4,
    "capacity": 50,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1287,
    "name": "M-412",
    "building": "M",
    "floor": 4,
    "capacity": 150,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1288,
    "name": "M-413",
    "building": "M",
    "floor": 4,
    "capacity": 25,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1289,
    "name": "M-414",
    "building": "M",
    "floor": 4,
    "capacity": 60,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1290,
    "name": "M-415",
    "building": "M",
    "floor": 4,
    "capacity": 12,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1291,
    "name": "M-416",
    "building": "M",
    "floor": 4,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1292,
    "name": "M-417",
    "building": "M",
    "floor": 4,
    "capacity": 75,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1293,
    "name": "M-418",
    "building": "M",
    "floor": 4,
    "capacity": 15,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1294,
    "name": "M-419",
    "building": "M",
    "floor": 4,
    "capacity": 35,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1295,
    "name": "M-420",
    "building": "M",
    "floor": 4,
    "capacity": 80,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1296,
    "name": "M-421",
    "building": "M",
    "floor": 4,
    "capacity": 18,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1297,
    "name": "M-422",
    "building": "M",
    "floor": 4,
    "capacity": 40,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1298,
    "name": "M-423",
    "building": "M",
    "floor": 4,
    "capacity": 100,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1299,
    "name": "M-424",
    "building": "M",
    "floor": 4,
    "capacity": 20,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1300,
    "name": "M-425",
    "building": "M",
    "floor": 4,
    "capacity": 45,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1301,
    "name": "N-101",
    "building": "N",
    "floor": 1,
    "capacity": 40,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1302,
    "name": "N-102",
    "building": "N",
    "floor": 1,
    "capacity": 100,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1303,
    "name": "N-103",
    "building": "N",
    "floor": 1,
    "capacity": 20,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1304,
    "name": "N-104",
    "building": "N",
    "floor": 1,
    "capacity": 45,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1305,
    "name": "N-105",
    "building": "N",
    "floor": 1,
    "capacity": 120,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1306,
    "name": "N-106",
    "building": "N",
    "floor": 1,
    "capacity": 24,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1307,
    "name": "N-107",
    "building": "N",
    "floor": 1,
    "capacity": 50,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1308,
    "name": "N-108",
    "building": "N",
    "floor": 1,
    "capacity": 150,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1309,
    "name": "N-109",
    "building": "N",
    "floor": 1,
    "capacity": 25,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1310,
    "name": "N-110",
    "building": "N",
    "floor": 1,
    "capacity": 60,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1311,
    "name": "N-111",
    "building": "N",
    "floor": 1,
    "capacity": 12,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1312,
    "name": "N-112",
    "building": "N",
    "floor": 1,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1313,
    "name": "N-113",
    "building": "N",
    "floor": 1,
    "capacity": 75,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1314,
    "name": "N-114",
    "building": "N",
    "floor": 1,
    "capacity": 15,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1315,
    "name": "N-115",
    "building": "N",
    "floor": 1,
    "capacity": 35,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1316,
    "name": "N-116",
    "building": "N",
    "floor": 1,
    "capacity": 80,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1317,
    "name": "N-117",
    "building": "N",
    "floor": 1,
    "capacity": 18,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1318,
    "name": "N-118",
    "building": "N",
    "floor": 1,
    "capacity": 40,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1319,
    "name": "N-119",
    "building": "N",
    "floor": 1,
    "capacity": 100,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1320,
    "name": "N-120",
    "building": "N",
    "floor": 1,
    "capacity": 20,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1321,
    "name": "N-121",
    "building": "N",
    "floor": 1,
    "capacity": 45,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1322,
    "name": "N-122",
    "building": "N",
    "floor": 1,
    "capacity": 120,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1323,
    "name": "N-123",
    "building": "N",
    "floor": 1,
    "capacity": 24,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1324,
    "name": "N-124",
    "building": "N",
    "floor": 1,
    "capacity": 50,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1325,
    "name": "N-125",
    "building": "N",
    "floor": 1,
    "capacity": 150,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1326,
    "name": "N-201",
    "building": "N",
    "floor": 2,
    "capacity": 40,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1327,
    "name": "N-202",
    "building": "N",
    "floor": 2,
    "capacity": 100,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1328,
    "name": "N-203",
    "building": "N",
    "floor": 2,
    "capacity": 20,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1329,
    "name": "N-204",
    "building": "N",
    "floor": 2,
    "capacity": 45,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1330,
    "name": "N-205",
    "building": "N",
    "floor": 2,
    "capacity": 120,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1331,
    "name": "N-206",
    "building": "N",
    "floor": 2,
    "capacity": 24,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1332,
    "name": "N-207",
    "building": "N",
    "floor": 2,
    "capacity": 50,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1333,
    "name": "N-208",
    "building": "N",
    "floor": 2,
    "capacity": 150,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1334,
    "name": "N-209",
    "building": "N",
    "floor": 2,
    "capacity": 25,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1335,
    "name": "N-210",
    "building": "N",
    "floor": 2,
    "capacity": 60,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1336,
    "name": "N-211",
    "building": "N",
    "floor": 2,
    "capacity": 12,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1337,
    "name": "N-212",
    "building": "N",
    "floor": 2,
    "capacity": 30,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1338,
    "name": "N-213",
    "building": "N",
    "floor": 2,
    "capacity": 75,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1339,
    "name": "N-214",
    "building": "N",
    "floor": 2,
    "capacity": 15,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1340,
    "name": "N-215",
    "building": "N",
    "floor": 2,
    "capacity": 35,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1341,
    "name": "N-216",
    "building": "N",
    "floor": 2,
    "capacity": 80,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1342,
    "name": "N-217",
    "building": "N",
    "floor": 2,
    "capacity": 18,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1343,
    "name": "N-218",
    "building": "N",
    "floor": 2,
    "capacity": 40,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1344,
    "name": "N-219",
    "building": "N",
    "floor": 2,
    "capacity": 100,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1345,
    "name": "N-220",
    "building": "N",
    "floor": 2,
    "capacity": 20,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1346,
    "name": "N-221",
    "building": "N",
    "floor": 2,
    "capacity": 45,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1347,
    "name": "N-222",
    "building": "N",
    "floor": 2,
    "capacity": 120,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1348,
    "name": "N-223",
    "building": "N",
    "floor": 2,
    "capacity": 24,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1349,
    "name": "N-224",
    "building": "N",
    "floor": 2,
    "capacity": 50,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1350,
    "name": "N-225",
    "building": "N",
    "floor": 2,
    "capacity": 150,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1351,
    "name": "N-301",
    "building": "N",
    "floor": 3,
    "capacity": 40,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1352,
    "name": "N-302",
    "building": "N",
    "floor": 3,
    "capacity": 100,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1353,
    "name": "N-303",
    "building": "N",
    "floor": 3,
    "capacity": 20,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1354,
    "name": "N-304",
    "building": "N",
    "floor": 3,
    "capacity": 45,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1355,
    "name": "N-305",
    "building": "N",
    "floor": 3,
    "capacity": 120,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1356,
    "name": "N-306",
    "building": "N",
    "floor": 3,
    "capacity": 24,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1357,
    "name": "N-307",
    "building": "N",
    "floor": 3,
    "capacity": 50,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1358,
    "name": "N-308",
    "building": "N",
    "floor": 3,
    "capacity": 150,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1359,
    "name": "N-309",
    "building": "N",
    "floor": 3,
    "capacity": 25,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1360,
    "name": "N-310",
    "building": "N",
    "floor": 3,
    "capacity": 60,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1361,
    "name": "N-311",
    "building": "N",
    "floor": 3,
    "capacity": 12,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1362,
    "name": "N-312",
    "building": "N",
    "floor": 3,
    "capacity": 30,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1363,
    "name": "N-313",
    "building": "N",
    "floor": 3,
    "capacity": 75,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1364,
    "name": "N-314",
    "building": "N",
    "floor": 3,
    "capacity": 15,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1365,
    "name": "N-315",
    "building": "N",
    "floor": 3,
    "capacity": 35,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1366,
    "name": "N-316",
    "building": "N",
    "floor": 3,
    "capacity": 80,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1367,
    "name": "N-317",
    "building": "N",
    "floor": 3,
    "capacity": 18,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1368,
    "name": "N-318",
    "building": "N",
    "floor": 3,
    "capacity": 40,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1369,
    "name": "N-319",
    "building": "N",
    "floor": 3,
    "capacity": 100,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1370,
    "name": "N-320",
    "building": "N",
    "floor": 3,
    "capacity": 20,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1371,
    "name": "N-321",
    "building": "N",
    "floor": 3,
    "capacity": 45,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1372,
    "name": "N-322",
    "building": "N",
    "floor": 3,
    "capacity": 120,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1373,
    "name": "N-323",
    "building": "N",
    "floor": 3,
    "capacity": 24,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1374,
    "name": "N-324",
    "building": "N",
    "floor": 3,
    "capacity": 50,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1375,
    "name": "N-325",
    "building": "N",
    "floor": 3,
    "capacity": 150,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1376,
    "name": "N-401",
    "building": "N",
    "floor": 4,
    "capacity": 40,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1377,
    "name": "N-402",
    "building": "N",
    "floor": 4,
    "capacity": 100,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1378,
    "name": "N-403",
    "building": "N",
    "floor": 4,
    "capacity": 20,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1379,
    "name": "N-404",
    "building": "N",
    "floor": 4,
    "capacity": 45,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1380,
    "name": "N-405",
    "building": "N",
    "floor": 4,
    "capacity": 120,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1381,
    "name": "N-406",
    "building": "N",
    "floor": 4,
    "capacity": 24,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1382,
    "name": "N-407",
    "building": "N",
    "floor": 4,
    "capacity": 50,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1383,
    "name": "N-408",
    "building": "N",
    "floor": 4,
    "capacity": 150,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1384,
    "name": "N-409",
    "building": "N",
    "floor": 4,
    "capacity": 25,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1385,
    "name": "N-410",
    "building": "N",
    "floor": 4,
    "capacity": 60,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1386,
    "name": "N-411",
    "building": "N",
    "floor": 4,
    "capacity": 12,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1387,
    "name": "N-412",
    "building": "N",
    "floor": 4,
    "capacity": 30,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1388,
    "name": "N-413",
    "building": "N",
    "floor": 4,
    "capacity": 75,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1389,
    "name": "N-414",
    "building": "N",
    "floor": 4,
    "capacity": 15,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1390,
    "name": "N-415",
    "building": "N",
    "floor": 4,
    "capacity": 35,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1391,
    "name": "N-416",
    "building": "N",
    "floor": 4,
    "capacity": 80,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1392,
    "name": "N-417",
    "building": "N",
    "floor": 4,
    "capacity": 18,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1393,
    "name": "N-418",
    "building": "N",
    "floor": 4,
    "capacity": 40,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1394,
    "name": "N-419",
    "building": "N",
    "floor": 4,
    "capacity": 100,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1395,
    "name": "N-420",
    "building": "N",
    "floor": 4,
    "capacity": 20,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1396,
    "name": "N-421",
    "building": "N",
    "floor": 4,
    "capacity": 45,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1397,
    "name": "N-422",
    "building": "N",
    "floor": 4,
    "capacity": 120,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1398,
    "name": "N-423",
    "building": "N",
    "floor": 4,
    "capacity": 24,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1399,
    "name": "N-424",
    "building": "N",
    "floor": 4,
    "capacity": 50,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1400,
    "name": "N-425",
    "building": "N",
    "floor": 4,
    "capacity": 150,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1401,
    "name": "O-101",
    "building": "O",
    "floor": 1,
    "capacity": 120,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1402,
    "name": "O-102",
    "building": "O",
    "floor": 1,
    "capacity": 24,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1403,
    "name": "O-103",
    "building": "O",
    "floor": 1,
    "capacity": 50,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1404,
    "name": "O-104",
    "building": "O",
    "floor": 1,
    "capacity": 150,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1405,
    "name": "O-105",
    "building": "O",
    "floor": 1,
    "capacity": 25,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1406,
    "name": "O-106",
    "building": "O",
    "floor": 1,
    "capacity": 60,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1407,
    "name": "O-107",
    "building": "O",
    "floor": 1,
    "capacity": 12,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1408,
    "name": "O-108",
    "building": "O",
    "floor": 1,
    "capacity": 30,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1409,
    "name": "O-109",
    "building": "O",
    "floor": 1,
    "capacity": 75,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1410,
    "name": "O-110",
    "building": "O",
    "floor": 1,
    "capacity": 15,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1411,
    "name": "O-111",
    "building": "O",
    "floor": 1,
    "capacity": 35,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1412,
    "name": "O-112",
    "building": "O",
    "floor": 1,
    "capacity": 80,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1413,
    "name": "O-113",
    "building": "O",
    "floor": 1,
    "capacity": 18,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1414,
    "name": "O-114",
    "building": "O",
    "floor": 1,
    "capacity": 40,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1415,
    "name": "O-115",
    "building": "O",
    "floor": 1,
    "capacity": 100,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1416,
    "name": "O-116",
    "building": "O",
    "floor": 1,
    "capacity": 20,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1417,
    "name": "O-117",
    "building": "O",
    "floor": 1,
    "capacity": 45,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1418,
    "name": "O-118",
    "building": "O",
    "floor": 1,
    "capacity": 120,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1419,
    "name": "O-119",
    "building": "O",
    "floor": 1,
    "capacity": 24,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1420,
    "name": "O-120",
    "building": "O",
    "floor": 1,
    "capacity": 50,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1421,
    "name": "O-121",
    "building": "O",
    "floor": 1,
    "capacity": 150,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1422,
    "name": "O-122",
    "building": "O",
    "floor": 1,
    "capacity": 25,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1423,
    "name": "O-123",
    "building": "O",
    "floor": 1,
    "capacity": 60,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1424,
    "name": "O-124",
    "building": "O",
    "floor": 1,
    "capacity": 12,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1425,
    "name": "O-125",
    "building": "O",
    "floor": 1,
    "capacity": 30,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1426,
    "name": "O-201",
    "building": "O",
    "floor": 2,
    "capacity": 120,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1427,
    "name": "O-202",
    "building": "O",
    "floor": 2,
    "capacity": 24,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1428,
    "name": "O-203",
    "building": "O",
    "floor": 2,
    "capacity": 50,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1429,
    "name": "O-204",
    "building": "O",
    "floor": 2,
    "capacity": 150,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1430,
    "name": "O-205",
    "building": "O",
    "floor": 2,
    "capacity": 25,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1431,
    "name": "O-206",
    "building": "O",
    "floor": 2,
    "capacity": 60,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1432,
    "name": "O-207",
    "building": "O",
    "floor": 2,
    "capacity": 12,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1433,
    "name": "O-208",
    "building": "O",
    "floor": 2,
    "capacity": 30,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1434,
    "name": "O-209",
    "building": "O",
    "floor": 2,
    "capacity": 75,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1435,
    "name": "O-210",
    "building": "O",
    "floor": 2,
    "capacity": 15,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1436,
    "name": "O-211",
    "building": "O",
    "floor": 2,
    "capacity": 35,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1437,
    "name": "O-212",
    "building": "O",
    "floor": 2,
    "capacity": 80,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1438,
    "name": "O-213",
    "building": "O",
    "floor": 2,
    "capacity": 18,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1439,
    "name": "O-214",
    "building": "O",
    "floor": 2,
    "capacity": 40,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1440,
    "name": "O-215",
    "building": "O",
    "floor": 2,
    "capacity": 100,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1441,
    "name": "O-216",
    "building": "O",
    "floor": 2,
    "capacity": 20,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1442,
    "name": "O-217",
    "building": "O",
    "floor": 2,
    "capacity": 45,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1443,
    "name": "O-218",
    "building": "O",
    "floor": 2,
    "capacity": 120,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1444,
    "name": "O-219",
    "building": "O",
    "floor": 2,
    "capacity": 24,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1445,
    "name": "O-220",
    "building": "O",
    "floor": 2,
    "capacity": 50,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1446,
    "name": "O-221",
    "building": "O",
    "floor": 2,
    "capacity": 150,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1447,
    "name": "O-222",
    "building": "O",
    "floor": 2,
    "capacity": 25,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1448,
    "name": "O-223",
    "building": "O",
    "floor": 2,
    "capacity": 60,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1449,
    "name": "O-224",
    "building": "O",
    "floor": 2,
    "capacity": 12,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1450,
    "name": "O-225",
    "building": "O",
    "floor": 2,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1451,
    "name": "O-301",
    "building": "O",
    "floor": 3,
    "capacity": 120,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1452,
    "name": "O-302",
    "building": "O",
    "floor": 3,
    "capacity": 24,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1453,
    "name": "O-303",
    "building": "O",
    "floor": 3,
    "capacity": 50,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1454,
    "name": "O-304",
    "building": "O",
    "floor": 3,
    "capacity": 150,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1455,
    "name": "O-305",
    "building": "O",
    "floor": 3,
    "capacity": 25,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1456,
    "name": "O-306",
    "building": "O",
    "floor": 3,
    "capacity": 60,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1457,
    "name": "O-307",
    "building": "O",
    "floor": 3,
    "capacity": 12,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1458,
    "name": "O-308",
    "building": "O",
    "floor": 3,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1459,
    "name": "O-309",
    "building": "O",
    "floor": 3,
    "capacity": 75,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1460,
    "name": "O-310",
    "building": "O",
    "floor": 3,
    "capacity": 15,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1461,
    "name": "O-311",
    "building": "O",
    "floor": 3,
    "capacity": 35,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1462,
    "name": "O-312",
    "building": "O",
    "floor": 3,
    "capacity": 80,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1463,
    "name": "O-313",
    "building": "O",
    "floor": 3,
    "capacity": 18,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1464,
    "name": "O-314",
    "building": "O",
    "floor": 3,
    "capacity": 40,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1465,
    "name": "O-315",
    "building": "O",
    "floor": 3,
    "capacity": 100,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1466,
    "name": "O-316",
    "building": "O",
    "floor": 3,
    "capacity": 20,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1467,
    "name": "O-317",
    "building": "O",
    "floor": 3,
    "capacity": 45,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1468,
    "name": "O-318",
    "building": "O",
    "floor": 3,
    "capacity": 120,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1469,
    "name": "O-319",
    "building": "O",
    "floor": 3,
    "capacity": 24,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1470,
    "name": "O-320",
    "building": "O",
    "floor": 3,
    "capacity": 50,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1471,
    "name": "O-321",
    "building": "O",
    "floor": 3,
    "capacity": 150,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1472,
    "name": "O-322",
    "building": "O",
    "floor": 3,
    "capacity": 25,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1473,
    "name": "O-323",
    "building": "O",
    "floor": 3,
    "capacity": 60,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1474,
    "name": "O-324",
    "building": "O",
    "floor": 3,
    "capacity": 12,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1475,
    "name": "O-325",
    "building": "O",
    "floor": 3,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1476,
    "name": "O-401",
    "building": "O",
    "floor": 4,
    "capacity": 120,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1477,
    "name": "O-402",
    "building": "O",
    "floor": 4,
    "capacity": 24,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1478,
    "name": "O-403",
    "building": "O",
    "floor": 4,
    "capacity": 50,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1479,
    "name": "O-404",
    "building": "O",
    "floor": 4,
    "capacity": 150,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1480,
    "name": "O-405",
    "building": "O",
    "floor": 4,
    "capacity": 25,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1481,
    "name": "O-406",
    "building": "O",
    "floor": 4,
    "capacity": 60,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1482,
    "name": "O-407",
    "building": "O",
    "floor": 4,
    "capacity": 12,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1483,
    "name": "O-408",
    "building": "O",
    "floor": 4,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1484,
    "name": "O-409",
    "building": "O",
    "floor": 4,
    "capacity": 75,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1485,
    "name": "O-410",
    "building": "O",
    "floor": 4,
    "capacity": 15,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1486,
    "name": "O-411",
    "building": "O",
    "floor": 4,
    "capacity": 35,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1487,
    "name": "O-412",
    "building": "O",
    "floor": 4,
    "capacity": 80,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1488,
    "name": "O-413",
    "building": "O",
    "floor": 4,
    "capacity": 18,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1489,
    "name": "O-414",
    "building": "O",
    "floor": 4,
    "capacity": 40,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1490,
    "name": "O-415",
    "building": "O",
    "floor": 4,
    "capacity": 100,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1491,
    "name": "O-416",
    "building": "O",
    "floor": 4,
    "capacity": 20,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1492,
    "name": "O-417",
    "building": "O",
    "floor": 4,
    "capacity": 45,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1493,
    "name": "O-418",
    "building": "O",
    "floor": 4,
    "capacity": 120,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1494,
    "name": "O-419",
    "building": "O",
    "floor": 4,
    "capacity": 24,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1495,
    "name": "O-420",
    "building": "O",
    "floor": 4,
    "capacity": 50,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1496,
    "name": "O-421",
    "building": "O",
    "floor": 4,
    "capacity": 150,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1497,
    "name": "O-422",
    "building": "O",
    "floor": 4,
    "capacity": 25,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1498,
    "name": "O-423",
    "building": "O",
    "floor": 4,
    "capacity": 60,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1499,
    "name": "O-424",
    "building": "O",
    "floor": 4,
    "capacity": 12,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1500,
    "name": "O-425",
    "building": "O",
    "floor": 4,
    "capacity": 30,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1501,
    "name": "P-101",
    "building": "P",
    "floor": 1,
    "capacity": 25,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1502,
    "name": "P-102",
    "building": "P",
    "floor": 1,
    "capacity": 60,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1503,
    "name": "P-103",
    "building": "P",
    "floor": 1,
    "capacity": 12,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1504,
    "name": "P-104",
    "building": "P",
    "floor": 1,
    "capacity": 30,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1505,
    "name": "P-105",
    "building": "P",
    "floor": 1,
    "capacity": 75,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1506,
    "name": "P-106",
    "building": "P",
    "floor": 1,
    "capacity": 15,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1507,
    "name": "P-107",
    "building": "P",
    "floor": 1,
    "capacity": 35,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1508,
    "name": "P-108",
    "building": "P",
    "floor": 1,
    "capacity": 80,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1509,
    "name": "P-109",
    "building": "P",
    "floor": 1,
    "capacity": 18,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1510,
    "name": "P-110",
    "building": "P",
    "floor": 1,
    "capacity": 40,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1511,
    "name": "P-111",
    "building": "P",
    "floor": 1,
    "capacity": 100,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1512,
    "name": "P-112",
    "building": "P",
    "floor": 1,
    "capacity": 20,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1513,
    "name": "P-113",
    "building": "P",
    "floor": 1,
    "capacity": 45,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1514,
    "name": "P-114",
    "building": "P",
    "floor": 1,
    "capacity": 120,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1515,
    "name": "P-115",
    "building": "P",
    "floor": 1,
    "capacity": 24,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1516,
    "name": "P-116",
    "building": "P",
    "floor": 1,
    "capacity": 50,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1517,
    "name": "P-117",
    "building": "P",
    "floor": 1,
    "capacity": 150,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1518,
    "name": "P-118",
    "building": "P",
    "floor": 1,
    "capacity": 25,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1519,
    "name": "P-119",
    "building": "P",
    "floor": 1,
    "capacity": 60,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1520,
    "name": "P-120",
    "building": "P",
    "floor": 1,
    "capacity": 12,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1521,
    "name": "P-121",
    "building": "P",
    "floor": 1,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1522,
    "name": "P-122",
    "building": "P",
    "floor": 1,
    "capacity": 75,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1523,
    "name": "P-123",
    "building": "P",
    "floor": 1,
    "capacity": 15,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1524,
    "name": "P-124",
    "building": "P",
    "floor": 1,
    "capacity": 35,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1525,
    "name": "P-125",
    "building": "P",
    "floor": 1,
    "capacity": 80,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1526,
    "name": "P-201",
    "building": "P",
    "floor": 2,
    "capacity": 25,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1527,
    "name": "P-202",
    "building": "P",
    "floor": 2,
    "capacity": 60,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1528,
    "name": "P-203",
    "building": "P",
    "floor": 2,
    "capacity": 12,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1529,
    "name": "P-204",
    "building": "P",
    "floor": 2,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1530,
    "name": "P-205",
    "building": "P",
    "floor": 2,
    "capacity": 75,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1531,
    "name": "P-206",
    "building": "P",
    "floor": 2,
    "capacity": 15,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1532,
    "name": "P-207",
    "building": "P",
    "floor": 2,
    "capacity": 35,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1533,
    "name": "P-208",
    "building": "P",
    "floor": 2,
    "capacity": 80,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1534,
    "name": "P-209",
    "building": "P",
    "floor": 2,
    "capacity": 18,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1535,
    "name": "P-210",
    "building": "P",
    "floor": 2,
    "capacity": 40,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1536,
    "name": "P-211",
    "building": "P",
    "floor": 2,
    "capacity": 100,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1537,
    "name": "P-212",
    "building": "P",
    "floor": 2,
    "capacity": 20,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1538,
    "name": "P-213",
    "building": "P",
    "floor": 2,
    "capacity": 45,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1539,
    "name": "P-214",
    "building": "P",
    "floor": 2,
    "capacity": 120,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1540,
    "name": "P-215",
    "building": "P",
    "floor": 2,
    "capacity": 24,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1541,
    "name": "P-216",
    "building": "P",
    "floor": 2,
    "capacity": 50,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1542,
    "name": "P-217",
    "building": "P",
    "floor": 2,
    "capacity": 150,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1543,
    "name": "P-218",
    "building": "P",
    "floor": 2,
    "capacity": 25,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1544,
    "name": "P-219",
    "building": "P",
    "floor": 2,
    "capacity": 60,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1545,
    "name": "P-220",
    "building": "P",
    "floor": 2,
    "capacity": 12,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1546,
    "name": "P-221",
    "building": "P",
    "floor": 2,
    "capacity": 30,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1547,
    "name": "P-222",
    "building": "P",
    "floor": 2,
    "capacity": 75,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1548,
    "name": "P-223",
    "building": "P",
    "floor": 2,
    "capacity": 15,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1549,
    "name": "P-224",
    "building": "P",
    "floor": 2,
    "capacity": 35,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1550,
    "name": "P-225",
    "building": "P",
    "floor": 2,
    "capacity": 80,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1551,
    "name": "P-301",
    "building": "P",
    "floor": 3,
    "capacity": 25,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1552,
    "name": "P-302",
    "building": "P",
    "floor": 3,
    "capacity": 60,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1553,
    "name": "P-303",
    "building": "P",
    "floor": 3,
    "capacity": 12,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1554,
    "name": "P-304",
    "building": "P",
    "floor": 3,
    "capacity": 30,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1555,
    "name": "P-305",
    "building": "P",
    "floor": 3,
    "capacity": 75,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1556,
    "name": "P-306",
    "building": "P",
    "floor": 3,
    "capacity": 15,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1557,
    "name": "P-307",
    "building": "P",
    "floor": 3,
    "capacity": 35,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1558,
    "name": "P-308",
    "building": "P",
    "floor": 3,
    "capacity": 80,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1559,
    "name": "P-309",
    "building": "P",
    "floor": 3,
    "capacity": 18,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1560,
    "name": "P-310",
    "building": "P",
    "floor": 3,
    "capacity": 40,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1561,
    "name": "P-311",
    "building": "P",
    "floor": 3,
    "capacity": 100,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1562,
    "name": "P-312",
    "building": "P",
    "floor": 3,
    "capacity": 20,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1563,
    "name": "P-313",
    "building": "P",
    "floor": 3,
    "capacity": 45,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1564,
    "name": "P-314",
    "building": "P",
    "floor": 3,
    "capacity": 120,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1565,
    "name": "P-315",
    "building": "P",
    "floor": 3,
    "capacity": 24,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1566,
    "name": "P-316",
    "building": "P",
    "floor": 3,
    "capacity": 50,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1567,
    "name": "P-317",
    "building": "P",
    "floor": 3,
    "capacity": 150,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1568,
    "name": "P-318",
    "building": "P",
    "floor": 3,
    "capacity": 25,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1569,
    "name": "P-319",
    "building": "P",
    "floor": 3,
    "capacity": 60,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1570,
    "name": "P-320",
    "building": "P",
    "floor": 3,
    "capacity": 12,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1571,
    "name": "P-321",
    "building": "P",
    "floor": 3,
    "capacity": 30,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1572,
    "name": "P-322",
    "building": "P",
    "floor": 3,
    "capacity": 75,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1573,
    "name": "P-323",
    "building": "P",
    "floor": 3,
    "capacity": 15,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1574,
    "name": "P-324",
    "building": "P",
    "floor": 3,
    "capacity": 35,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1575,
    "name": "P-325",
    "building": "P",
    "floor": 3,
    "capacity": 80,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1576,
    "name": "P-401",
    "building": "P",
    "floor": 4,
    "capacity": 25,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1577,
    "name": "P-402",
    "building": "P",
    "floor": 4,
    "capacity": 60,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1578,
    "name": "P-403",
    "building": "P",
    "floor": 4,
    "capacity": 12,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1579,
    "name": "P-404",
    "building": "P",
    "floor": 4,
    "capacity": 30,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1580,
    "name": "P-405",
    "building": "P",
    "floor": 4,
    "capacity": 75,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1581,
    "name": "P-406",
    "building": "P",
    "floor": 4,
    "capacity": 15,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1582,
    "name": "P-407",
    "building": "P",
    "floor": 4,
    "capacity": 35,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1583,
    "name": "P-408",
    "building": "P",
    "floor": 4,
    "capacity": 80,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1584,
    "name": "P-409",
    "building": "P",
    "floor": 4,
    "capacity": 18,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1585,
    "name": "P-410",
    "building": "P",
    "floor": 4,
    "capacity": 40,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1586,
    "name": "P-411",
    "building": "P",
    "floor": 4,
    "capacity": 100,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1587,
    "name": "P-412",
    "building": "P",
    "floor": 4,
    "capacity": 20,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1588,
    "name": "P-413",
    "building": "P",
    "floor": 4,
    "capacity": 45,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1589,
    "name": "P-414",
    "building": "P",
    "floor": 4,
    "capacity": 120,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1590,
    "name": "P-415",
    "building": "P",
    "floor": 4,
    "capacity": 24,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1591,
    "name": "P-416",
    "building": "P",
    "floor": 4,
    "capacity": 50,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1592,
    "name": "P-417",
    "building": "P",
    "floor": 4,
    "capacity": 150,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1593,
    "name": "P-418",
    "building": "P",
    "floor": 4,
    "capacity": 25,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1594,
    "name": "P-419",
    "building": "P",
    "floor": 4,
    "capacity": 60,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1595,
    "name": "P-420",
    "building": "P",
    "floor": 4,
    "capacity": 12,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1596,
    "name": "P-421",
    "building": "P",
    "floor": 4,
    "capacity": 30,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1597,
    "name": "P-422",
    "building": "P",
    "floor": 4,
    "capacity": 75,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1598,
    "name": "P-423",
    "building": "P",
    "floor": 4,
    "capacity": 15,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1599,
    "name": "P-424",
    "building": "P",
    "floor": 4,
    "capacity": 35,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1600,
    "name": "P-425",
    "building": "P",
    "floor": 4,
    "capacity": 80,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1601,
    "name": "Q-101",
    "building": "Q",
    "floor": 1,
    "capacity": 75,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1602,
    "name": "Q-102",
    "building": "Q",
    "floor": 1,
    "capacity": 15,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1603,
    "name": "Q-103",
    "building": "Q",
    "floor": 1,
    "capacity": 35,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1604,
    "name": "Q-104",
    "building": "Q",
    "floor": 1,
    "capacity": 80,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1605,
    "name": "Q-105",
    "building": "Q",
    "floor": 1,
    "capacity": 18,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1606,
    "name": "Q-106",
    "building": "Q",
    "floor": 1,
    "capacity": 40,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1607,
    "name": "Q-107",
    "building": "Q",
    "floor": 1,
    "capacity": 100,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1608,
    "name": "Q-108",
    "building": "Q",
    "floor": 1,
    "capacity": 20,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1609,
    "name": "Q-109",
    "building": "Q",
    "floor": 1,
    "capacity": 45,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1610,
    "name": "Q-110",
    "building": "Q",
    "floor": 1,
    "capacity": 120,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1611,
    "name": "Q-111",
    "building": "Q",
    "floor": 1,
    "capacity": 24,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1612,
    "name": "Q-112",
    "building": "Q",
    "floor": 1,
    "capacity": 50,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1613,
    "name": "Q-113",
    "building": "Q",
    "floor": 1,
    "capacity": 150,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1614,
    "name": "Q-114",
    "building": "Q",
    "floor": 1,
    "capacity": 25,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1615,
    "name": "Q-115",
    "building": "Q",
    "floor": 1,
    "capacity": 60,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1616,
    "name": "Q-116",
    "building": "Q",
    "floor": 1,
    "capacity": 12,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1617,
    "name": "Q-117",
    "building": "Q",
    "floor": 1,
    "capacity": 30,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1618,
    "name": "Q-118",
    "building": "Q",
    "floor": 1,
    "capacity": 75,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1619,
    "name": "Q-119",
    "building": "Q",
    "floor": 1,
    "capacity": 15,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1620,
    "name": "Q-120",
    "building": "Q",
    "floor": 1,
    "capacity": 35,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1621,
    "name": "Q-121",
    "building": "Q",
    "floor": 1,
    "capacity": 80,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1622,
    "name": "Q-122",
    "building": "Q",
    "floor": 1,
    "capacity": 18,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1623,
    "name": "Q-123",
    "building": "Q",
    "floor": 1,
    "capacity": 40,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1624,
    "name": "Q-124",
    "building": "Q",
    "floor": 1,
    "capacity": 100,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1625,
    "name": "Q-125",
    "building": "Q",
    "floor": 1,
    "capacity": 20,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1626,
    "name": "Q-201",
    "building": "Q",
    "floor": 2,
    "capacity": 75,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1627,
    "name": "Q-202",
    "building": "Q",
    "floor": 2,
    "capacity": 15,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1628,
    "name": "Q-203",
    "building": "Q",
    "floor": 2,
    "capacity": 35,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1629,
    "name": "Q-204",
    "building": "Q",
    "floor": 2,
    "capacity": 80,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1630,
    "name": "Q-205",
    "building": "Q",
    "floor": 2,
    "capacity": 18,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1631,
    "name": "Q-206",
    "building": "Q",
    "floor": 2,
    "capacity": 40,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1632,
    "name": "Q-207",
    "building": "Q",
    "floor": 2,
    "capacity": 100,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1633,
    "name": "Q-208",
    "building": "Q",
    "floor": 2,
    "capacity": 20,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1634,
    "name": "Q-209",
    "building": "Q",
    "floor": 2,
    "capacity": 45,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1635,
    "name": "Q-210",
    "building": "Q",
    "floor": 2,
    "capacity": 120,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1636,
    "name": "Q-211",
    "building": "Q",
    "floor": 2,
    "capacity": 24,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1637,
    "name": "Q-212",
    "building": "Q",
    "floor": 2,
    "capacity": 50,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1638,
    "name": "Q-213",
    "building": "Q",
    "floor": 2,
    "capacity": 150,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1639,
    "name": "Q-214",
    "building": "Q",
    "floor": 2,
    "capacity": 25,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1640,
    "name": "Q-215",
    "building": "Q",
    "floor": 2,
    "capacity": 60,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1641,
    "name": "Q-216",
    "building": "Q",
    "floor": 2,
    "capacity": 12,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1642,
    "name": "Q-217",
    "building": "Q",
    "floor": 2,
    "capacity": 30,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1643,
    "name": "Q-218",
    "building": "Q",
    "floor": 2,
    "capacity": 75,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1644,
    "name": "Q-219",
    "building": "Q",
    "floor": 2,
    "capacity": 15,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1645,
    "name": "Q-220",
    "building": "Q",
    "floor": 2,
    "capacity": 35,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1646,
    "name": "Q-221",
    "building": "Q",
    "floor": 2,
    "capacity": 80,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1647,
    "name": "Q-222",
    "building": "Q",
    "floor": 2,
    "capacity": 18,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1648,
    "name": "Q-223",
    "building": "Q",
    "floor": 2,
    "capacity": 40,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1649,
    "name": "Q-224",
    "building": "Q",
    "floor": 2,
    "capacity": 100,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1650,
    "name": "Q-225",
    "building": "Q",
    "floor": 2,
    "capacity": 20,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1651,
    "name": "Q-301",
    "building": "Q",
    "floor": 3,
    "capacity": 75,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1652,
    "name": "Q-302",
    "building": "Q",
    "floor": 3,
    "capacity": 15,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1653,
    "name": "Q-303",
    "building": "Q",
    "floor": 3,
    "capacity": 35,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1654,
    "name": "Q-304",
    "building": "Q",
    "floor": 3,
    "capacity": 80,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1655,
    "name": "Q-305",
    "building": "Q",
    "floor": 3,
    "capacity": 18,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1656,
    "name": "Q-306",
    "building": "Q",
    "floor": 3,
    "capacity": 40,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1657,
    "name": "Q-307",
    "building": "Q",
    "floor": 3,
    "capacity": 100,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1658,
    "name": "Q-308",
    "building": "Q",
    "floor": 3,
    "capacity": 20,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1659,
    "name": "Q-309",
    "building": "Q",
    "floor": 3,
    "capacity": 45,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1660,
    "name": "Q-310",
    "building": "Q",
    "floor": 3,
    "capacity": 120,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1661,
    "name": "Q-311",
    "building": "Q",
    "floor": 3,
    "capacity": 24,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1662,
    "name": "Q-312",
    "building": "Q",
    "floor": 3,
    "capacity": 50,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1663,
    "name": "Q-313",
    "building": "Q",
    "floor": 3,
    "capacity": 150,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1664,
    "name": "Q-314",
    "building": "Q",
    "floor": 3,
    "capacity": 25,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1665,
    "name": "Q-315",
    "building": "Q",
    "floor": 3,
    "capacity": 60,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1666,
    "name": "Q-316",
    "building": "Q",
    "floor": 3,
    "capacity": 12,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1667,
    "name": "Q-317",
    "building": "Q",
    "floor": 3,
    "capacity": 30,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1668,
    "name": "Q-318",
    "building": "Q",
    "floor": 3,
    "capacity": 75,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1669,
    "name": "Q-319",
    "building": "Q",
    "floor": 3,
    "capacity": 15,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1670,
    "name": "Q-320",
    "building": "Q",
    "floor": 3,
    "capacity": 35,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1671,
    "name": "Q-321",
    "building": "Q",
    "floor": 3,
    "capacity": 80,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1672,
    "name": "Q-322",
    "building": "Q",
    "floor": 3,
    "capacity": 18,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1673,
    "name": "Q-323",
    "building": "Q",
    "floor": 3,
    "capacity": 40,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1674,
    "name": "Q-324",
    "building": "Q",
    "floor": 3,
    "capacity": 100,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1675,
    "name": "Q-325",
    "building": "Q",
    "floor": 3,
    "capacity": 20,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1676,
    "name": "Q-401",
    "building": "Q",
    "floor": 4,
    "capacity": 75,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1677,
    "name": "Q-402",
    "building": "Q",
    "floor": 4,
    "capacity": 15,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1678,
    "name": "Q-403",
    "building": "Q",
    "floor": 4,
    "capacity": 35,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1679,
    "name": "Q-404",
    "building": "Q",
    "floor": 4,
    "capacity": 80,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1680,
    "name": "Q-405",
    "building": "Q",
    "floor": 4,
    "capacity": 18,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1681,
    "name": "Q-406",
    "building": "Q",
    "floor": 4,
    "capacity": 40,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1682,
    "name": "Q-407",
    "building": "Q",
    "floor": 4,
    "capacity": 100,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1683,
    "name": "Q-408",
    "building": "Q",
    "floor": 4,
    "capacity": 20,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1684,
    "name": "Q-409",
    "building": "Q",
    "floor": 4,
    "capacity": 45,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1685,
    "name": "Q-410",
    "building": "Q",
    "floor": 4,
    "capacity": 120,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1686,
    "name": "Q-411",
    "building": "Q",
    "floor": 4,
    "capacity": 24,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1687,
    "name": "Q-412",
    "building": "Q",
    "floor": 4,
    "capacity": 50,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1688,
    "name": "Q-413",
    "building": "Q",
    "floor": 4,
    "capacity": 150,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1689,
    "name": "Q-414",
    "building": "Q",
    "floor": 4,
    "capacity": 25,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1690,
    "name": "Q-415",
    "building": "Q",
    "floor": 4,
    "capacity": 60,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1691,
    "name": "Q-416",
    "building": "Q",
    "floor": 4,
    "capacity": 12,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1692,
    "name": "Q-417",
    "building": "Q",
    "floor": 4,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1693,
    "name": "Q-418",
    "building": "Q",
    "floor": 4,
    "capacity": 75,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1694,
    "name": "Q-419",
    "building": "Q",
    "floor": 4,
    "capacity": 15,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1695,
    "name": "Q-420",
    "building": "Q",
    "floor": 4,
    "capacity": 35,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1696,
    "name": "Q-421",
    "building": "Q",
    "floor": 4,
    "capacity": 80,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1697,
    "name": "Q-422",
    "building": "Q",
    "floor": 4,
    "capacity": 18,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1698,
    "name": "Q-423",
    "building": "Q",
    "floor": 4,
    "capacity": 40,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1699,
    "name": "Q-424",
    "building": "Q",
    "floor": 4,
    "capacity": 100,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1700,
    "name": "Q-425",
    "building": "Q",
    "floor": 4,
    "capacity": 20,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1701,
    "name": "R-101",
    "building": "R",
    "floor": 1,
    "capacity": 18,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1702,
    "name": "R-102",
    "building": "R",
    "floor": 1,
    "capacity": 40,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1703,
    "name": "R-103",
    "building": "R",
    "floor": 1,
    "capacity": 100,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1704,
    "name": "R-104",
    "building": "R",
    "floor": 1,
    "capacity": 20,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1705,
    "name": "R-105",
    "building": "R",
    "floor": 1,
    "capacity": 45,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1706,
    "name": "R-106",
    "building": "R",
    "floor": 1,
    "capacity": 120,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1707,
    "name": "R-107",
    "building": "R",
    "floor": 1,
    "capacity": 24,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1708,
    "name": "R-108",
    "building": "R",
    "floor": 1,
    "capacity": 50,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1709,
    "name": "R-109",
    "building": "R",
    "floor": 1,
    "capacity": 150,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1710,
    "name": "R-110",
    "building": "R",
    "floor": 1,
    "capacity": 25,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1711,
    "name": "R-111",
    "building": "R",
    "floor": 1,
    "capacity": 60,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1712,
    "name": "R-112",
    "building": "R",
    "floor": 1,
    "capacity": 12,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1713,
    "name": "R-113",
    "building": "R",
    "floor": 1,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1714,
    "name": "R-114",
    "building": "R",
    "floor": 1,
    "capacity": 75,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1715,
    "name": "R-115",
    "building": "R",
    "floor": 1,
    "capacity": 15,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1716,
    "name": "R-116",
    "building": "R",
    "floor": 1,
    "capacity": 35,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1717,
    "name": "R-117",
    "building": "R",
    "floor": 1,
    "capacity": 80,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1718,
    "name": "R-118",
    "building": "R",
    "floor": 1,
    "capacity": 18,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1719,
    "name": "R-119",
    "building": "R",
    "floor": 1,
    "capacity": 40,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1720,
    "name": "R-120",
    "building": "R",
    "floor": 1,
    "capacity": 100,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1721,
    "name": "R-121",
    "building": "R",
    "floor": 1,
    "capacity": 20,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1722,
    "name": "R-122",
    "building": "R",
    "floor": 1,
    "capacity": 45,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1723,
    "name": "R-123",
    "building": "R",
    "floor": 1,
    "capacity": 120,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1724,
    "name": "R-124",
    "building": "R",
    "floor": 1,
    "capacity": 24,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1725,
    "name": "R-125",
    "building": "R",
    "floor": 1,
    "capacity": 50,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1726,
    "name": "R-201",
    "building": "R",
    "floor": 2,
    "capacity": 18,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1727,
    "name": "R-202",
    "building": "R",
    "floor": 2,
    "capacity": 40,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1728,
    "name": "R-203",
    "building": "R",
    "floor": 2,
    "capacity": 100,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1729,
    "name": "R-204",
    "building": "R",
    "floor": 2,
    "capacity": 20,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1730,
    "name": "R-205",
    "building": "R",
    "floor": 2,
    "capacity": 45,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1731,
    "name": "R-206",
    "building": "R",
    "floor": 2,
    "capacity": 120,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1732,
    "name": "R-207",
    "building": "R",
    "floor": 2,
    "capacity": 24,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1733,
    "name": "R-208",
    "building": "R",
    "floor": 2,
    "capacity": 50,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1734,
    "name": "R-209",
    "building": "R",
    "floor": 2,
    "capacity": 150,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1735,
    "name": "R-210",
    "building": "R",
    "floor": 2,
    "capacity": 25,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1736,
    "name": "R-211",
    "building": "R",
    "floor": 2,
    "capacity": 60,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1737,
    "name": "R-212",
    "building": "R",
    "floor": 2,
    "capacity": 12,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1738,
    "name": "R-213",
    "building": "R",
    "floor": 2,
    "capacity": 30,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1739,
    "name": "R-214",
    "building": "R",
    "floor": 2,
    "capacity": 75,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1740,
    "name": "R-215",
    "building": "R",
    "floor": 2,
    "capacity": 15,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1741,
    "name": "R-216",
    "building": "R",
    "floor": 2,
    "capacity": 35,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1742,
    "name": "R-217",
    "building": "R",
    "floor": 2,
    "capacity": 80,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1743,
    "name": "R-218",
    "building": "R",
    "floor": 2,
    "capacity": 18,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1744,
    "name": "R-219",
    "building": "R",
    "floor": 2,
    "capacity": 40,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1745,
    "name": "R-220",
    "building": "R",
    "floor": 2,
    "capacity": 100,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1746,
    "name": "R-221",
    "building": "R",
    "floor": 2,
    "capacity": 20,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1747,
    "name": "R-222",
    "building": "R",
    "floor": 2,
    "capacity": 45,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1748,
    "name": "R-223",
    "building": "R",
    "floor": 2,
    "capacity": 120,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1749,
    "name": "R-224",
    "building": "R",
    "floor": 2,
    "capacity": 24,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1750,
    "name": "R-225",
    "building": "R",
    "floor": 2,
    "capacity": 50,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1751,
    "name": "R-301",
    "building": "R",
    "floor": 3,
    "capacity": 18,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1752,
    "name": "R-302",
    "building": "R",
    "floor": 3,
    "capacity": 40,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1753,
    "name": "R-303",
    "building": "R",
    "floor": 3,
    "capacity": 100,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1754,
    "name": "R-304",
    "building": "R",
    "floor": 3,
    "capacity": 20,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1755,
    "name": "R-305",
    "building": "R",
    "floor": 3,
    "capacity": 45,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1756,
    "name": "R-306",
    "building": "R",
    "floor": 3,
    "capacity": 120,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1757,
    "name": "R-307",
    "building": "R",
    "floor": 3,
    "capacity": 24,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1758,
    "name": "R-308",
    "building": "R",
    "floor": 3,
    "capacity": 50,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1759,
    "name": "R-309",
    "building": "R",
    "floor": 3,
    "capacity": 150,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1760,
    "name": "R-310",
    "building": "R",
    "floor": 3,
    "capacity": 25,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1761,
    "name": "R-311",
    "building": "R",
    "floor": 3,
    "capacity": 60,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1762,
    "name": "R-312",
    "building": "R",
    "floor": 3,
    "capacity": 12,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1763,
    "name": "R-313",
    "building": "R",
    "floor": 3,
    "capacity": 30,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1764,
    "name": "R-314",
    "building": "R",
    "floor": 3,
    "capacity": 75,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1765,
    "name": "R-315",
    "building": "R",
    "floor": 3,
    "capacity": 15,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1766,
    "name": "R-316",
    "building": "R",
    "floor": 3,
    "capacity": 35,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1767,
    "name": "R-317",
    "building": "R",
    "floor": 3,
    "capacity": 80,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1768,
    "name": "R-318",
    "building": "R",
    "floor": 3,
    "capacity": 18,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1769,
    "name": "R-319",
    "building": "R",
    "floor": 3,
    "capacity": 40,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1770,
    "name": "R-320",
    "building": "R",
    "floor": 3,
    "capacity": 100,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1771,
    "name": "R-321",
    "building": "R",
    "floor": 3,
    "capacity": 20,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1772,
    "name": "R-322",
    "building": "R",
    "floor": 3,
    "capacity": 45,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1773,
    "name": "R-323",
    "building": "R",
    "floor": 3,
    "capacity": 120,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1774,
    "name": "R-324",
    "building": "R",
    "floor": 3,
    "capacity": 24,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1775,
    "name": "R-325",
    "building": "R",
    "floor": 3,
    "capacity": 50,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1776,
    "name": "R-401",
    "building": "R",
    "floor": 4,
    "capacity": 18,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1777,
    "name": "R-402",
    "building": "R",
    "floor": 4,
    "capacity": 40,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1778,
    "name": "R-403",
    "building": "R",
    "floor": 4,
    "capacity": 100,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1779,
    "name": "R-404",
    "building": "R",
    "floor": 4,
    "capacity": 20,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1780,
    "name": "R-405",
    "building": "R",
    "floor": 4,
    "capacity": 45,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1781,
    "name": "R-406",
    "building": "R",
    "floor": 4,
    "capacity": 120,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1782,
    "name": "R-407",
    "building": "R",
    "floor": 4,
    "capacity": 24,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1783,
    "name": "R-408",
    "building": "R",
    "floor": 4,
    "capacity": 50,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1784,
    "name": "R-409",
    "building": "R",
    "floor": 4,
    "capacity": 150,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1785,
    "name": "R-410",
    "building": "R",
    "floor": 4,
    "capacity": 25,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1786,
    "name": "R-411",
    "building": "R",
    "floor": 4,
    "capacity": 60,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1787,
    "name": "R-412",
    "building": "R",
    "floor": 4,
    "capacity": 12,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1788,
    "name": "R-413",
    "building": "R",
    "floor": 4,
    "capacity": 30,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1789,
    "name": "R-414",
    "building": "R",
    "floor": 4,
    "capacity": 75,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1790,
    "name": "R-415",
    "building": "R",
    "floor": 4,
    "capacity": 15,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1791,
    "name": "R-416",
    "building": "R",
    "floor": 4,
    "capacity": 35,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1792,
    "name": "R-417",
    "building": "R",
    "floor": 4,
    "capacity": 80,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1793,
    "name": "R-418",
    "building": "R",
    "floor": 4,
    "capacity": 18,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1794,
    "name": "R-419",
    "building": "R",
    "floor": 4,
    "capacity": 40,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1795,
    "name": "R-420",
    "building": "R",
    "floor": 4,
    "capacity": 100,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1796,
    "name": "R-421",
    "building": "R",
    "floor": 4,
    "capacity": 20,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1797,
    "name": "R-422",
    "building": "R",
    "floor": 4,
    "capacity": 45,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1798,
    "name": "R-423",
    "building": "R",
    "floor": 4,
    "capacity": 120,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1799,
    "name": "R-424",
    "building": "R",
    "floor": 4,
    "capacity": 24,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1800,
    "name": "R-425",
    "building": "R",
    "floor": 4,
    "capacity": 50,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1801,
    "name": "S-101",
    "building": "S",
    "floor": 1,
    "capacity": 45,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1802,
    "name": "S-102",
    "building": "S",
    "floor": 1,
    "capacity": 120,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1803,
    "name": "S-103",
    "building": "S",
    "floor": 1,
    "capacity": 24,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1804,
    "name": "S-104",
    "building": "S",
    "floor": 1,
    "capacity": 50,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1805,
    "name": "S-105",
    "building": "S",
    "floor": 1,
    "capacity": 150,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1806,
    "name": "S-106",
    "building": "S",
    "floor": 1,
    "capacity": 25,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1807,
    "name": "S-107",
    "building": "S",
    "floor": 1,
    "capacity": 60,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1808,
    "name": "S-108",
    "building": "S",
    "floor": 1,
    "capacity": 12,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1809,
    "name": "S-109",
    "building": "S",
    "floor": 1,
    "capacity": 30,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1810,
    "name": "S-110",
    "building": "S",
    "floor": 1,
    "capacity": 75,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1811,
    "name": "S-111",
    "building": "S",
    "floor": 1,
    "capacity": 15,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1812,
    "name": "S-112",
    "building": "S",
    "floor": 1,
    "capacity": 35,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1813,
    "name": "S-113",
    "building": "S",
    "floor": 1,
    "capacity": 80,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1814,
    "name": "S-114",
    "building": "S",
    "floor": 1,
    "capacity": 18,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1815,
    "name": "S-115",
    "building": "S",
    "floor": 1,
    "capacity": 40,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1816,
    "name": "S-116",
    "building": "S",
    "floor": 1,
    "capacity": 100,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1817,
    "name": "S-117",
    "building": "S",
    "floor": 1,
    "capacity": 20,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1818,
    "name": "S-118",
    "building": "S",
    "floor": 1,
    "capacity": 45,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1819,
    "name": "S-119",
    "building": "S",
    "floor": 1,
    "capacity": 120,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1820,
    "name": "S-120",
    "building": "S",
    "floor": 1,
    "capacity": 24,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1821,
    "name": "S-121",
    "building": "S",
    "floor": 1,
    "capacity": 50,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1822,
    "name": "S-122",
    "building": "S",
    "floor": 1,
    "capacity": 150,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1823,
    "name": "S-123",
    "building": "S",
    "floor": 1,
    "capacity": 25,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1824,
    "name": "S-124",
    "building": "S",
    "floor": 1,
    "capacity": 60,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1825,
    "name": "S-125",
    "building": "S",
    "floor": 1,
    "capacity": 12,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1826,
    "name": "S-201",
    "building": "S",
    "floor": 2,
    "capacity": 45,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1827,
    "name": "S-202",
    "building": "S",
    "floor": 2,
    "capacity": 120,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1828,
    "name": "S-203",
    "building": "S",
    "floor": 2,
    "capacity": 24,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1829,
    "name": "S-204",
    "building": "S",
    "floor": 2,
    "capacity": 50,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1830,
    "name": "S-205",
    "building": "S",
    "floor": 2,
    "capacity": 150,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1831,
    "name": "S-206",
    "building": "S",
    "floor": 2,
    "capacity": 25,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1832,
    "name": "S-207",
    "building": "S",
    "floor": 2,
    "capacity": 60,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1833,
    "name": "S-208",
    "building": "S",
    "floor": 2,
    "capacity": 12,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1834,
    "name": "S-209",
    "building": "S",
    "floor": 2,
    "capacity": 30,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1835,
    "name": "S-210",
    "building": "S",
    "floor": 2,
    "capacity": 75,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1836,
    "name": "S-211",
    "building": "S",
    "floor": 2,
    "capacity": 15,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1837,
    "name": "S-212",
    "building": "S",
    "floor": 2,
    "capacity": 35,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1838,
    "name": "S-213",
    "building": "S",
    "floor": 2,
    "capacity": 80,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1839,
    "name": "S-214",
    "building": "S",
    "floor": 2,
    "capacity": 18,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1840,
    "name": "S-215",
    "building": "S",
    "floor": 2,
    "capacity": 40,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1841,
    "name": "S-216",
    "building": "S",
    "floor": 2,
    "capacity": 100,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1842,
    "name": "S-217",
    "building": "S",
    "floor": 2,
    "capacity": 20,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1843,
    "name": "S-218",
    "building": "S",
    "floor": 2,
    "capacity": 45,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1844,
    "name": "S-219",
    "building": "S",
    "floor": 2,
    "capacity": 120,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1845,
    "name": "S-220",
    "building": "S",
    "floor": 2,
    "capacity": 24,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1846,
    "name": "S-221",
    "building": "S",
    "floor": 2,
    "capacity": 50,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1847,
    "name": "S-222",
    "building": "S",
    "floor": 2,
    "capacity": 150,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1848,
    "name": "S-223",
    "building": "S",
    "floor": 2,
    "capacity": 25,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1849,
    "name": "S-224",
    "building": "S",
    "floor": 2,
    "capacity": 60,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1850,
    "name": "S-225",
    "building": "S",
    "floor": 2,
    "capacity": 12,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1851,
    "name": "S-301",
    "building": "S",
    "floor": 3,
    "capacity": 45,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1852,
    "name": "S-302",
    "building": "S",
    "floor": 3,
    "capacity": 120,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1853,
    "name": "S-303",
    "building": "S",
    "floor": 3,
    "capacity": 24,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1854,
    "name": "S-304",
    "building": "S",
    "floor": 3,
    "capacity": 50,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1855,
    "name": "S-305",
    "building": "S",
    "floor": 3,
    "capacity": 150,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1856,
    "name": "S-306",
    "building": "S",
    "floor": 3,
    "capacity": 25,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1857,
    "name": "S-307",
    "building": "S",
    "floor": 3,
    "capacity": 60,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1858,
    "name": "S-308",
    "building": "S",
    "floor": 3,
    "capacity": 12,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1859,
    "name": "S-309",
    "building": "S",
    "floor": 3,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1860,
    "name": "S-310",
    "building": "S",
    "floor": 3,
    "capacity": 75,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1861,
    "name": "S-311",
    "building": "S",
    "floor": 3,
    "capacity": 15,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1862,
    "name": "S-312",
    "building": "S",
    "floor": 3,
    "capacity": 35,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1863,
    "name": "S-313",
    "building": "S",
    "floor": 3,
    "capacity": 80,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1864,
    "name": "S-314",
    "building": "S",
    "floor": 3,
    "capacity": 18,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1865,
    "name": "S-315",
    "building": "S",
    "floor": 3,
    "capacity": 40,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1866,
    "name": "S-316",
    "building": "S",
    "floor": 3,
    "capacity": 100,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1867,
    "name": "S-317",
    "building": "S",
    "floor": 3,
    "capacity": 20,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1868,
    "name": "S-318",
    "building": "S",
    "floor": 3,
    "capacity": 45,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1869,
    "name": "S-319",
    "building": "S",
    "floor": 3,
    "capacity": 120,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1870,
    "name": "S-320",
    "building": "S",
    "floor": 3,
    "capacity": 24,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1871,
    "name": "S-321",
    "building": "S",
    "floor": 3,
    "capacity": 50,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1872,
    "name": "S-322",
    "building": "S",
    "floor": 3,
    "capacity": 150,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1873,
    "name": "S-323",
    "building": "S",
    "floor": 3,
    "capacity": 25,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1874,
    "name": "S-324",
    "building": "S",
    "floor": 3,
    "capacity": 60,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1875,
    "name": "S-325",
    "building": "S",
    "floor": 3,
    "capacity": 12,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1876,
    "name": "S-401",
    "building": "S",
    "floor": 4,
    "capacity": 45,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1877,
    "name": "S-402",
    "building": "S",
    "floor": 4,
    "capacity": 120,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1878,
    "name": "S-403",
    "building": "S",
    "floor": 4,
    "capacity": 24,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1879,
    "name": "S-404",
    "building": "S",
    "floor": 4,
    "capacity": 50,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1880,
    "name": "S-405",
    "building": "S",
    "floor": 4,
    "capacity": 150,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1881,
    "name": "S-406",
    "building": "S",
    "floor": 4,
    "capacity": 25,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1882,
    "name": "S-407",
    "building": "S",
    "floor": 4,
    "capacity": 60,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1883,
    "name": "S-408",
    "building": "S",
    "floor": 4,
    "capacity": 12,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1884,
    "name": "S-409",
    "building": "S",
    "floor": 4,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1885,
    "name": "S-410",
    "building": "S",
    "floor": 4,
    "capacity": 75,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1886,
    "name": "S-411",
    "building": "S",
    "floor": 4,
    "capacity": 15,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1887,
    "name": "S-412",
    "building": "S",
    "floor": 4,
    "capacity": 35,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1888,
    "name": "S-413",
    "building": "S",
    "floor": 4,
    "capacity": 80,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1889,
    "name": "S-414",
    "building": "S",
    "floor": 4,
    "capacity": 18,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1890,
    "name": "S-415",
    "building": "S",
    "floor": 4,
    "capacity": 40,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1891,
    "name": "S-416",
    "building": "S",
    "floor": 4,
    "capacity": 100,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1892,
    "name": "S-417",
    "building": "S",
    "floor": 4,
    "capacity": 20,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1893,
    "name": "S-418",
    "building": "S",
    "floor": 4,
    "capacity": 45,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1894,
    "name": "S-419",
    "building": "S",
    "floor": 4,
    "capacity": 120,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1895,
    "name": "S-420",
    "building": "S",
    "floor": 4,
    "capacity": 24,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1896,
    "name": "S-421",
    "building": "S",
    "floor": 4,
    "capacity": 50,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1897,
    "name": "S-422",
    "building": "S",
    "floor": 4,
    "capacity": 150,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1898,
    "name": "S-423",
    "building": "S",
    "floor": 4,
    "capacity": 25,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1899,
    "name": "S-424",
    "building": "S",
    "floor": 4,
    "capacity": 60,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1900,
    "name": "S-425",
    "building": "S",
    "floor": 4,
    "capacity": 12,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1901,
    "name": "T-101",
    "building": "T",
    "floor": 1,
    "capacity": 150,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1902,
    "name": "T-102",
    "building": "T",
    "floor": 1,
    "capacity": 25,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1903,
    "name": "T-103",
    "building": "T",
    "floor": 1,
    "capacity": 60,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1904,
    "name": "T-104",
    "building": "T",
    "floor": 1,
    "capacity": 12,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1905,
    "name": "T-105",
    "building": "T",
    "floor": 1,
    "capacity": 30,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1906,
    "name": "T-106",
    "building": "T",
    "floor": 1,
    "capacity": 75,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1907,
    "name": "T-107",
    "building": "T",
    "floor": 1,
    "capacity": 15,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1908,
    "name": "T-108",
    "building": "T",
    "floor": 1,
    "capacity": 35,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1909,
    "name": "T-109",
    "building": "T",
    "floor": 1,
    "capacity": 80,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1910,
    "name": "T-110",
    "building": "T",
    "floor": 1,
    "capacity": 18,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1911,
    "name": "T-111",
    "building": "T",
    "floor": 1,
    "capacity": 40,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1912,
    "name": "T-112",
    "building": "T",
    "floor": 1,
    "capacity": 100,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1913,
    "name": "T-113",
    "building": "T",
    "floor": 1,
    "capacity": 20,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1914,
    "name": "T-114",
    "building": "T",
    "floor": 1,
    "capacity": 45,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1915,
    "name": "T-115",
    "building": "T",
    "floor": 1,
    "capacity": 120,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1916,
    "name": "T-116",
    "building": "T",
    "floor": 1,
    "capacity": 24,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1917,
    "name": "T-117",
    "building": "T",
    "floor": 1,
    "capacity": 50,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1918,
    "name": "T-118",
    "building": "T",
    "floor": 1,
    "capacity": 150,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1919,
    "name": "T-119",
    "building": "T",
    "floor": 1,
    "capacity": 25,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1920,
    "name": "T-120",
    "building": "T",
    "floor": 1,
    "capacity": 60,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1921,
    "name": "T-121",
    "building": "T",
    "floor": 1,
    "capacity": 12,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1922,
    "name": "T-122",
    "building": "T",
    "floor": 1,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1923,
    "name": "T-123",
    "building": "T",
    "floor": 1,
    "capacity": 75,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1924,
    "name": "T-124",
    "building": "T",
    "floor": 1,
    "capacity": 15,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1925,
    "name": "T-125",
    "building": "T",
    "floor": 1,
    "capacity": 35,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1926,
    "name": "T-201",
    "building": "T",
    "floor": 2,
    "capacity": 150,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1927,
    "name": "T-202",
    "building": "T",
    "floor": 2,
    "capacity": 25,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1928,
    "name": "T-203",
    "building": "T",
    "floor": 2,
    "capacity": 60,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1929,
    "name": "T-204",
    "building": "T",
    "floor": 2,
    "capacity": 12,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1930,
    "name": "T-205",
    "building": "T",
    "floor": 2,
    "capacity": 30,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1931,
    "name": "T-206",
    "building": "T",
    "floor": 2,
    "capacity": 75,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1932,
    "name": "T-207",
    "building": "T",
    "floor": 2,
    "capacity": 15,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1933,
    "name": "T-208",
    "building": "T",
    "floor": 2,
    "capacity": 35,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1934,
    "name": "T-209",
    "building": "T",
    "floor": 2,
    "capacity": 80,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1935,
    "name": "T-210",
    "building": "T",
    "floor": 2,
    "capacity": 18,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1936,
    "name": "T-211",
    "building": "T",
    "floor": 2,
    "capacity": 40,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1937,
    "name": "T-212",
    "building": "T",
    "floor": 2,
    "capacity": 100,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1938,
    "name": "T-213",
    "building": "T",
    "floor": 2,
    "capacity": 20,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1939,
    "name": "T-214",
    "building": "T",
    "floor": 2,
    "capacity": 45,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1940,
    "name": "T-215",
    "building": "T",
    "floor": 2,
    "capacity": 120,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1941,
    "name": "T-216",
    "building": "T",
    "floor": 2,
    "capacity": 24,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1942,
    "name": "T-217",
    "building": "T",
    "floor": 2,
    "capacity": 50,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1943,
    "name": "T-218",
    "building": "T",
    "floor": 2,
    "capacity": 150,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1944,
    "name": "T-219",
    "building": "T",
    "floor": 2,
    "capacity": 25,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1945,
    "name": "T-220",
    "building": "T",
    "floor": 2,
    "capacity": 60,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1946,
    "name": "T-221",
    "building": "T",
    "floor": 2,
    "capacity": 12,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1947,
    "name": "T-222",
    "building": "T",
    "floor": 2,
    "capacity": 30,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1948,
    "name": "T-223",
    "building": "T",
    "floor": 2,
    "capacity": 75,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1949,
    "name": "T-224",
    "building": "T",
    "floor": 2,
    "capacity": 15,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1950,
    "name": "T-225",
    "building": "T",
    "floor": 2,
    "capacity": 35,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1951,
    "name": "T-301",
    "building": "T",
    "floor": 3,
    "capacity": 150,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1952,
    "name": "T-302",
    "building": "T",
    "floor": 3,
    "capacity": 25,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1953,
    "name": "T-303",
    "building": "T",
    "floor": 3,
    "capacity": 60,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1954,
    "name": "T-304",
    "building": "T",
    "floor": 3,
    "capacity": 12,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1955,
    "name": "T-305",
    "building": "T",
    "floor": 3,
    "capacity": 30,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1956,
    "name": "T-306",
    "building": "T",
    "floor": 3,
    "capacity": 75,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1957,
    "name": "T-307",
    "building": "T",
    "floor": 3,
    "capacity": 15,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1958,
    "name": "T-308",
    "building": "T",
    "floor": 3,
    "capacity": 35,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1959,
    "name": "T-309",
    "building": "T",
    "floor": 3,
    "capacity": 80,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1960,
    "name": "T-310",
    "building": "T",
    "floor": 3,
    "capacity": 18,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1961,
    "name": "T-311",
    "building": "T",
    "floor": 3,
    "capacity": 40,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1962,
    "name": "T-312",
    "building": "T",
    "floor": 3,
    "capacity": 100,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1963,
    "name": "T-313",
    "building": "T",
    "floor": 3,
    "capacity": 20,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1964,
    "name": "T-314",
    "building": "T",
    "floor": 3,
    "capacity": 45,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1965,
    "name": "T-315",
    "building": "T",
    "floor": 3,
    "capacity": 120,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1966,
    "name": "T-316",
    "building": "T",
    "floor": 3,
    "capacity": 24,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1967,
    "name": "T-317",
    "building": "T",
    "floor": 3,
    "capacity": 50,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1968,
    "name": "T-318",
    "building": "T",
    "floor": 3,
    "capacity": 150,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1969,
    "name": "T-319",
    "building": "T",
    "floor": 3,
    "capacity": 25,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1970,
    "name": "T-320",
    "building": "T",
    "floor": 3,
    "capacity": 60,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1971,
    "name": "T-321",
    "building": "T",
    "floor": 3,
    "capacity": 12,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1972,
    "name": "T-322",
    "building": "T",
    "floor": 3,
    "capacity": 30,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1973,
    "name": "T-323",
    "building": "T",
    "floor": 3,
    "capacity": 75,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1974,
    "name": "T-324",
    "building": "T",
    "floor": 3,
    "capacity": 15,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1975,
    "name": "T-325",
    "building": "T",
    "floor": 3,
    "capacity": 35,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1976,
    "name": "T-401",
    "building": "T",
    "floor": 4,
    "capacity": 150,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1977,
    "name": "T-402",
    "building": "T",
    "floor": 4,
    "capacity": 25,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1978,
    "name": "T-403",
    "building": "T",
    "floor": 4,
    "capacity": 60,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1979,
    "name": "T-404",
    "building": "T",
    "floor": 4,
    "capacity": 12,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1980,
    "name": "T-405",
    "building": "T",
    "floor": 4,
    "capacity": 30,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1981,
    "name": "T-406",
    "building": "T",
    "floor": 4,
    "capacity": 75,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1982,
    "name": "T-407",
    "building": "T",
    "floor": 4,
    "capacity": 15,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1983,
    "name": "T-408",
    "building": "T",
    "floor": 4,
    "capacity": 35,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1984,
    "name": "T-409",
    "building": "T",
    "floor": 4,
    "capacity": 80,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1985,
    "name": "T-410",
    "building": "T",
    "floor": 4,
    "capacity": 18,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1986,
    "name": "T-411",
    "building": "T",
    "floor": 4,
    "capacity": 40,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1987,
    "name": "T-412",
    "building": "T",
    "floor": 4,
    "capacity": 100,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1988,
    "name": "T-413",
    "building": "T",
    "floor": 4,
    "capacity": 20,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1989,
    "name": "T-414",
    "building": "T",
    "floor": 4,
    "capacity": 45,
    "equipment": [
      "computers",
      "projector"
    ]
  },
  {
    "id": 1990,
    "name": "T-415",
    "building": "T",
    "floor": 4,
    "capacity": 120,
    "equipment": [
      "projector",
      "audio",
      "video"
    ]
  },
  {
    "id": 1991,
    "name": "T-416",
    "building": "T",
    "floor": 4,
    "capacity": 24,
    "equipment": [
      "computers"
    ]
  },
  {
    "id": 1992,
    "name": "T-417",
    "building": "T",
    "floor": 4,
    "capacity": 50,
    "equipment": [
      "projector",
      "audio",
      "video",
      "whiteboard"
    ]
  },
  {
    "id": 1993,
    "name": "T-418",
    "building": "T",
    "floor": 4,
    "capacity": 150,
    "equipment": [
      "computers",
      "projector",
      "audio"
    ]
  },
  {
    "id": 1994,
    "name": "T-419",
    "building": "T",
    "floor": 4,
    "capacity": 25,
    "equipment": [
      "whiteboard"
    ]
  },
  {
    "id": 1995,
    "name": "T-420",
    "building": "T",
    "floor": 4,
    "capacity": 60,
    "equipment": [
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 1996,
    "name": "T-421",
    "building": "T",
    "floor": 4,
    "capacity": 12,
    "equipment": [
      "projector",
      "whiteboard"
    ]
  },
  {
    "id": 1997,
    "name": "T-422",
    "building": "T",
    "floor": 4,
    "capacity": 30,
    "equipment": [
      "computers",
      "whiteboard"
    ]
  },
  {
    "id": 1998,
    "name": "T-423",
    "building": "T",
    "floor": 4,
    "capacity": 75,
    "equipment": [
      "projector",
      "audio"
    ]
  },
  {
    "id": 1999,
    "name": "T-424",
    "building": "T",
    "floor": 4,
    "capacity": 15,
    "equipment": [
      "projector",
      "whiteboard",
      "audio"
    ]
  },
  {
    "id": 2000,
    "name": "T-425",
    "building": "T",
    "floor": 4,
    "capacity": 35,
    "equipment": [
      "computers",
      "projector"
    ]
  }
] as unknown as Room[]

type SeedBooking = [id: number, roomId: number, userId: number, dayOffset: number, start: string, end: string, status: BookingStatus, comment: string]

const SEED_BOOKINGS: SeedBooking[] = [
  [
    1,
    1,
    1,
    1,
    "10:00",
    "11:30",
    "active",
    "Консультация"
  ],
  [
    2,
    1,
    2,
    1,
    "14:00",
    "15:30",
    "active",
    "Подготовка к семинару"
  ],
  [
    3,
    4,
    2,
    1,
    "09:00",
    "10:30",
    "active",
    "Собрание группы"
  ],
  [
    4,
    7,
    3,
    1,
    "12:00",
    "14:00",
    "active",
    "Встреча с деканом"
  ],
  [
    5,
    1,
    1,
    0,
    "15:00",
    "16:00",
    "cancelled",
    "Отменили"
  ],
  [
    6,
    10,
    2,
    2,
    "13:00",
    "15:00",
    "active",
    "Лекция"
  ],
  [
    7,
    5,
    1,
    1,
    "16:00",
    "17:30",
    "active",
    "Кружок"
  ],
  [
    8,
    2,
    28,
    1,
    "15:00",
    "16:30",
    "active",
    "Лабораторный практикум по реляционным базам данных"
  ],
  [
    9,
    3,
    22,
    0,
    "15:30",
    "17:00",
    "active",
    "Лекция: Архитектура микропроцессоров и низкоуровневое программирование"
  ],
  [
    10,
    6,
    56,
    1,
    "13:00",
    "14:30",
    "active",
    "Семинар по математическому анализу: кратные интегралы и ряды"
  ],
  [
    11,
    8,
    10,
    1,
    "12:00",
    "13:30",
    "active",
    "Практикум по алгоритмам и структурам данных на современном C++"
  ],
  [
    12,
    9,
    4,
    0,
    "13:30",
    "15:00",
    "active",
    "Командный созвон хакатон-команды по веб-разработке"
  ],
  [
    13,
    11,
    18,
    0,
    "16:00",
    "17:30",
    "active",
    "Заседание студенческого научного общества ФИСТ"
  ],
  [
    14,
    12,
    38,
    1,
    "11:00",
    "12:30",
    "active",
    "Репетиция доклада на международную научно-практическую конференцию"
  ],
  [
    15,
    13,
    32,
    0,
    "14:00",
    "16:00",
    "active",
    "Защита курсового проекта по сетям и телекоммуникациям"
  ],
  [
    16,
    14,
    52,
    1,
    "14:30",
    "16:00",
    "active",
    "Консультация перед рубежным контролем по дифференциальным уравнениям"
  ],
  [
    17,
    15,
    46,
    0,
    "09:00",
    "10:30",
    "active",
    "Воркшоп по введению в глубокое обучение и библиотеки PyTorch"
  ],
  [
    18,
    16,
    6,
    1,
    "13:30",
    "15:00",
    "active",
    "Собрание старостата факультета информационных технологий"
  ],
  [
    19,
    17,
    60,
    0,
    "14:00",
    "15:30",
    "active",
    "Занятие кружка олимпиадного программирования ACM ICPC"
  ],
  [
    20,
    18,
    20,
    1,
    "16:00",
    "17:30",
    "active",
    "Мастер-класс по проектированию пользовательских интерфейсов в Figma"
  ],
  [
    21,
    19,
    14,
    0,
    "16:30",
    "18:00",
    "active",
    "Лабораторная работа: сетевые протоколы, маршрутизация и BGP"
  ],
  [
    22,
    20,
    34,
    1,
    "14:00",
    "16:00",
    "active",
    "Встреча с техническим директором IT-компании: стажировки и карьера"
  ],
  [
    23,
    21,
    28,
    0,
    "11:30",
    "13:00",
    "active",
    "Коллоквиум по дискретной математике, комбинаторике и теории графов"
  ],
  [
    24,
    22,
    48,
    1,
    "09:00",
    "10:30",
    "active",
    "Собеседование в студенческую лабораторию искусственного интеллекта"
  ],
  [
    25,
    23,
    42,
    0,
    "10:30",
    "12:00",
    "active",
    "Семинар кафедры: предзащита кандидатских диссертаций"
  ],
  [
    26,
    24,
    2,
    1,
    "14:00",
    "15:30",
    "active",
    "Репетиция творческого коллектива к праздничному концерту студвесны"
  ],
  [
    27,
    25,
    56,
    0,
    "15:00",
    "16:30",
    "active",
    "Тестирование производительности и аудит безопасности веб-сервиса"
  ],
  [
    28,
    26,
    16,
    1,
    "16:30",
    "18:00",
    "active",
    "Заседание учебно-методической комиссии факультета"
  ],
  [
    29,
    27,
    10,
    0,
    "09:30",
    "11:00",
    "active",
    "Практикум по операционным системам: потоки, мьютексы и межпроцессное взаимодействие"
  ],
  [
    30,
    28,
    30,
    1,
    "11:30",
    "13:00",
    "active",
    "Организационное собрание волонтёрского корпуса университета"
  ],
  [
    31,
    29,
    24,
    0,
    "13:00",
    "14:30",
    "active",
    "Семинар по физике полупроводников: наноструктуры и квантовая оптика"
  ],
  [
    32,
    30,
    44,
    1,
    "10:30",
    "12:00",
    "active",
    "Презентация выпускных квалификационных работ бакалавров"
  ],
  [
    33,
    31,
    38,
    0,
    "12:00",
    "13:30",
    "active",
    "Консультация для студентов по линейной алгебре и аналитической геометрии"
  ],
  [
    34,
    32,
    58,
    1,
    "15:00",
    "16:30",
    "active",
    "Турнир университетской киберспортивной лиги по дисциплине Dota 2"
  ],
  [
    35,
    33,
    52,
    0,
    "15:30",
    "17:00",
    "active",
    "Лабораторная работа по криптографическим алгоритмам и шифрованию данных"
  ],
  [
    36,
    34,
    12,
    1,
    "09:30",
    "11:00",
    "active",
    "Круглый стол: этика применения генеративных моделей в образовании"
  ],
  [
    37,
    35,
    6,
    0,
    "11:00",
    "12:30",
    "active",
    "Практическое занятие по профессиональному английскому для инженеров"
  ],
  [
    38,
    36,
    26,
    1,
    "13:00",
    "14:30",
    "active",
    "Собрание проектной группы: архитектура микросервисов на Go"
  ],
  [
    39,
    37,
    20,
    0,
    "14:30",
    "16:00",
    "active",
    "Хакатон: подготовка финального питча и технической демонстрации"
  ],
  [
    40,
    38,
    40,
    1,
    "12:00",
    "13:30",
    "active",
    "Лекция приглашённого профессора по квантовым вычислениям и кубитам"
  ],
  [
    41,
    39,
    34,
    0,
    "13:30",
    "15:00",
    "active",
    "Практическое занятие по компьютерной графике, OpenGL и шейдерам"
  ],
  [
    42,
    40,
    54,
    1,
    "15:30",
    "17:00",
    "active",
    "Встреча академического куратора со старостами и первокурсниками"
  ],
  [
    43,
    41,
    48,
    0,
    "16:00",
    "17:30",
    "active",
    "Научный семинар: нейроморфные процессоры и спайковые нейронные сети"
  ],
  [
    44,
    42,
    8,
    1,
    "11:00",
    "12:30",
    "active",
    "Собрание экологического и туристического клуба университета"
  ],
  [
    45,
    43,
    2,
    0,
    "14:00",
    "16:00",
    "active",
    "Защита лабораторных работ по параллельным и распределённым вычислениям"
  ],
  [
    46,
    44,
    22,
    1,
    "14:30",
    "16:00",
    "active",
    "Отработка пропущенных лабораторных занятий по материаловедению"
  ],
  [
    47,
    45,
    16,
    0,
    "09:00",
    "10:30",
    "active",
    "Интеллектуальная игра Что? Где? Когда? среди студенческих команд"
  ],
  [
    48,
    46,
    36,
    1,
    "13:30",
    "15:00",
    "active",
    "Скрининг резюме и серия пробных технических собеседований для выпускников"
  ],
  [
    49,
    47,
    30,
    0,
    "14:00",
    "15:30",
    "active",
    "Семинар: архитектурные паттерны масштабируемых фронтенд-приложений"
  ],
  [
    50,
    48,
    50,
    1,
    "16:00",
    "17:30",
    "active",
    "Заседание студсовета: распределение путёвок и материальной помощи"
  ],
  [
    51,
    49,
    44,
    0,
    "16:30",
    "18:00",
    "active",
    "Вводная лекция по встраиваемым системам и микроконтроллерам STM32"
  ],
  [
    52,
    50,
    4,
    1,
    "14:00",
    "16:00",
    "active",
    "Проведение университетского отборочного этапа Всероссийской олимпиады"
  ],
  [
    53,
    51,
    58,
    0,
    "11:30",
    "13:00",
    "active",
    "Лабораторный практикум по реляционным базам данных"
  ],
  [
    54,
    52,
    18,
    1,
    "09:00",
    "10:30",
    "active",
    "Лекция: Архитектура микропроцессоров и низкоуровневое программирование"
  ],
  [
    55,
    53,
    12,
    0,
    "10:30",
    "12:00",
    "active",
    "Семинар по математическому анализу: кратные интегралы и ряды"
  ],
  [
    56,
    54,
    32,
    1,
    "14:00",
    "15:30",
    "active",
    "Практикум по алгоритмам и структурам данных на современном C++"
  ],
  [
    57,
    55,
    26,
    0,
    "15:00",
    "16:30",
    "active",
    "Командный созвон хакатон-команды по веб-разработке"
  ],
  [
    58,
    56,
    46,
    1,
    "16:30",
    "18:00",
    "active",
    "Заседание студенческого научного общества ФИСТ"
  ],
  [
    59,
    57,
    40,
    0,
    "09:30",
    "11:00",
    "active",
    "Репетиция доклада на международную научно-практическую конференцию"
  ],
  [
    60,
    58,
    60,
    1,
    "11:30",
    "13:00",
    "active",
    "Защита курсового проекта по сетям и телекоммуникациям"
  ],
  [
    61,
    59,
    54,
    0,
    "13:00",
    "14:30",
    "active",
    "Консультация перед рубежным контролем по дифференциальным уравнениям"
  ],
  [
    62,
    60,
    14,
    1,
    "10:30",
    "12:00",
    "active",
    "Воркшоп по введению в глубокое обучение и библиотеки PyTorch"
  ],
  [
    63,
    61,
    8,
    0,
    "12:00",
    "13:30",
    "active",
    "Собрание старостата факультета информационных технологий"
  ],
  [
    64,
    62,
    28,
    1,
    "15:00",
    "16:30",
    "active",
    "Занятие кружка олимпиадного программирования ACM ICPC"
  ],
  [
    65,
    63,
    22,
    0,
    "15:30",
    "17:00",
    "active",
    "Мастер-класс по проектированию пользовательских интерфейсов в Figma"
  ],
  [
    66,
    64,
    42,
    1,
    "09:30",
    "11:00",
    "active",
    "Лабораторная работа: сетевые протоколы, маршрутизация и BGP"
  ],
  [
    67,
    65,
    36,
    0,
    "11:00",
    "12:30",
    "active",
    "Встреча с техническим директором IT-компании: стажировки и карьера"
  ],
  [
    68,
    66,
    56,
    1,
    "13:00",
    "14:30",
    "active",
    "Коллоквиум по дискретной математике, комбинаторике и теории графов"
  ],
  [
    69,
    67,
    50,
    0,
    "14:30",
    "16:00",
    "active",
    "Собеседование в студенческую лабораторию искусственного интеллекта"
  ],
  [
    70,
    68,
    10,
    1,
    "12:00",
    "13:30",
    "active",
    "Семинар кафедры: предзащита кандидатских диссертаций"
  ],
  [
    71,
    69,
    4,
    0,
    "13:30",
    "15:00",
    "active",
    "Репетиция творческого коллектива к праздничному концерту студвесны"
  ],
  [
    72,
    70,
    24,
    1,
    "15:30",
    "17:00",
    "active",
    "Тестирование производительности и аудит безопасности веб-сервиса"
  ],
  [
    73,
    71,
    18,
    0,
    "16:00",
    "17:30",
    "active",
    "Заседание учебно-методической комиссии факультета"
  ],
  [
    74,
    72,
    38,
    1,
    "11:00",
    "12:30",
    "active",
    "Практикум по операционным системам: потоки, мьютексы и межпроцессное взаимодействие"
  ],
  [
    75,
    73,
    32,
    0,
    "14:00",
    "16:00",
    "active",
    "Организационное собрание волонтёрского корпуса университета"
  ],
  [
    76,
    74,
    52,
    1,
    "14:30",
    "16:00",
    "active",
    "Семинар по физике полупроводников: наноструктуры и квантовая оптика"
  ],
  [
    77,
    75,
    46,
    0,
    "09:00",
    "10:30",
    "active",
    "Презентация выпускных квалификационных работ бакалавров"
  ],
  [
    78,
    76,
    6,
    1,
    "13:30",
    "15:00",
    "active",
    "Консультация для студентов по линейной алгебре и аналитической геометрии"
  ],
  [
    79,
    77,
    60,
    0,
    "14:00",
    "15:30",
    "active",
    "Турнир университетской киберспортивной лиги по дисциплине Dota 2"
  ],
  [
    80,
    78,
    20,
    1,
    "16:00",
    "17:30",
    "active",
    "Лабораторная работа по криптографическим алгоритмам и шифрованию данных"
  ],
  [
    81,
    79,
    14,
    0,
    "16:30",
    "18:00",
    "active",
    "Круглый стол: этика применения генеративных моделей в образовании"
  ],
  [
    82,
    80,
    34,
    1,
    "14:00",
    "16:00",
    "active",
    "Практическое занятие по профессиональному английскому для инженеров"
  ],
  [
    83,
    81,
    28,
    0,
    "11:30",
    "13:00",
    "active",
    "Собрание проектной группы: архитектура микросервисов на Go"
  ],
  [
    84,
    82,
    48,
    1,
    "09:00",
    "10:30",
    "active",
    "Хакатон: подготовка финального питча и технической демонстрации"
  ],
  [
    85,
    83,
    42,
    0,
    "10:30",
    "12:00",
    "active",
    "Лекция приглашённого профессора по квантовым вычислениям и кубитам"
  ],
  [
    86,
    84,
    2,
    1,
    "14:00",
    "15:30",
    "active",
    "Практическое занятие по компьютерной графике, OpenGL и шейдерам"
  ],
  [
    87,
    85,
    56,
    0,
    "15:00",
    "16:30",
    "active",
    "Встреча академического куратора со старостами и первокурсниками"
  ],
  [
    88,
    86,
    16,
    1,
    "16:30",
    "18:00",
    "active",
    "Научный семинар: нейроморфные процессоры и спайковые нейронные сети"
  ],
  [
    89,
    87,
    10,
    0,
    "09:30",
    "11:00",
    "active",
    "Собрание экологического и туристического клуба университета"
  ],
  [
    90,
    88,
    30,
    1,
    "11:30",
    "13:00",
    "active",
    "Защита лабораторных работ по параллельным и распределённым вычислениям"
  ],
  [
    91,
    89,
    24,
    0,
    "13:00",
    "14:30",
    "active",
    "Отработка пропущенных лабораторных занятий по материаловедению"
  ],
  [
    92,
    90,
    44,
    1,
    "10:30",
    "12:00",
    "active",
    "Интеллектуальная игра Что? Где? Когда? среди студенческих команд"
  ],
  [
    93,
    91,
    38,
    0,
    "12:00",
    "13:30",
    "active",
    "Скрининг резюме и серия пробных технических собеседований для выпускников"
  ],
  [
    94,
    92,
    58,
    1,
    "15:00",
    "16:30",
    "active",
    "Семинар: архитектурные паттерны масштабируемых фронтенд-приложений"
  ],
  [
    95,
    93,
    52,
    0,
    "15:30",
    "17:00",
    "active",
    "Заседание студсовета: распределение путёвок и материальной помощи"
  ],
  [
    96,
    94,
    12,
    1,
    "09:30",
    "11:00",
    "active",
    "Вводная лекция по встраиваемым системам и микроконтроллерам STM32"
  ],
  [
    97,
    110,
    51,
    0,
    "11:00",
    "12:30",
    "active",
    "Проведение университетского отборочного этапа Всероссийской олимпиады"
  ],
  [
    98,
    111,
    11,
    1,
    "13:00",
    "14:30",
    "active",
    "Лабораторный практикум по реляционным базам данных"
  ],
  [
    99,
    112,
    5,
    0,
    "14:30",
    "16:00",
    "active",
    "Лекция: Архитектура микропроцессоров и низкоуровневое программирование"
  ],
  [
    100,
    113,
    25,
    1,
    "12:00",
    "13:30",
    "active",
    "Семинар по математическому анализу: кратные интегралы и ряды"
  ],
  [
    101,
    114,
    19,
    0,
    "13:30",
    "15:00",
    "active",
    "Практикум по алгоритмам и структурам данных на современном C++"
  ],
  [
    102,
    115,
    39,
    1,
    "15:30",
    "17:00",
    "active",
    "Командный созвон хакатон-команды по веб-разработке"
  ],
  [
    103,
    116,
    33,
    0,
    "16:00",
    "17:30",
    "active",
    "Заседание студенческого научного общества ФИСТ"
  ],
  [
    104,
    117,
    53,
    1,
    "11:00",
    "12:30",
    "active",
    "Репетиция доклада на международную научно-практическую конференцию"
  ],
  [
    105,
    118,
    47,
    0,
    "14:00",
    "16:00",
    "active",
    "Защита курсового проекта по сетям и телекоммуникациям"
  ],
  [
    106,
    119,
    7,
    1,
    "14:30",
    "16:00",
    "active",
    "Консультация перед рубежным контролем по дифференциальным уравнениям"
  ],
  [
    107,
    120,
    1,
    0,
    "09:00",
    "10:30",
    "active",
    "Воркшоп по введению в глубокое обучение и библиотеки PyTorch"
  ],
  [
    108,
    121,
    21,
    1,
    "13:30",
    "15:00",
    "active",
    "Собрание старостата факультета информационных технологий"
  ],
  [
    109,
    122,
    15,
    0,
    "14:00",
    "15:30",
    "active",
    "Занятие кружка олимпиадного программирования ACM ICPC"
  ],
  [
    110,
    123,
    35,
    1,
    "16:00",
    "17:30",
    "active",
    "Мастер-класс по проектированию пользовательских интерфейсов в Figma"
  ],
  [
    111,
    124,
    29,
    0,
    "16:30",
    "18:00",
    "active",
    "Лабораторная работа: сетевые протоколы, маршрутизация и BGP"
  ],
  [
    112,
    125,
    49,
    1,
    "14:00",
    "16:00",
    "active",
    "Встреча с техническим директором IT-компании: стажировки и карьера"
  ],
  [
    113,
    126,
    43,
    0,
    "11:30",
    "13:00",
    "active",
    "Коллоквиум по дискретной математике, комбинаторике и теории графов"
  ],
  [
    114,
    127,
    3,
    1,
    "09:00",
    "10:30",
    "active",
    "Собеседование в студенческую лабораторию искусственного интеллекта"
  ],
  [
    115,
    128,
    57,
    0,
    "10:30",
    "12:00",
    "active",
    "Семинар кафедры: предзащита кандидатских диссертаций"
  ],
  [
    116,
    129,
    17,
    1,
    "14:00",
    "15:30",
    "active",
    "Репетиция творческого коллектива к праздничному концерту студвесны"
  ],
  [
    117,
    130,
    11,
    0,
    "15:00",
    "16:30",
    "active",
    "Тестирование производительности и аудит безопасности веб-сервиса"
  ],
  [
    118,
    131,
    31,
    1,
    "16:30",
    "18:00",
    "active",
    "Заседание учебно-методической комиссии факультета"
  ],
  [
    119,
    132,
    25,
    0,
    "09:30",
    "11:00",
    "active",
    "Практикум по операционным системам: потоки, мьютексы и межпроцессное взаимодействие"
  ],
  [
    120,
    133,
    45,
    1,
    "11:30",
    "13:00",
    "active",
    "Организационное собрание волонтёрского корпуса университета"
  ],
  [
    121,
    134,
    39,
    0,
    "13:00",
    "14:30",
    "active",
    "Семинар по физике полупроводников: наноструктуры и квантовая оптика"
  ],
  [
    122,
    135,
    59,
    1,
    "10:30",
    "12:00",
    "active",
    "Презентация выпускных квалификационных работ бакалавров"
  ],
  [
    123,
    136,
    53,
    0,
    "12:00",
    "13:30",
    "active",
    "Консультация для студентов по линейной алгебре и аналитической геометрии"
  ],
  [
    124,
    137,
    13,
    1,
    "15:00",
    "16:30",
    "active",
    "Турнир университетской киберспортивной лиги по дисциплине Dota 2"
  ],
  [
    125,
    138,
    7,
    0,
    "15:30",
    "17:00",
    "active",
    "Лабораторная работа по криптографическим алгоритмам и шифрованию данных"
  ],
  [
    126,
    139,
    27,
    1,
    "09:30",
    "11:00",
    "active",
    "Круглый стол: этика применения генеративных моделей в образовании"
  ],
  [
    127,
    140,
    21,
    0,
    "11:00",
    "12:30",
    "active",
    "Практическое занятие по профессиональному английскому для инженеров"
  ],
  [
    128,
    141,
    41,
    1,
    "13:00",
    "14:30",
    "active",
    "Собрание проектной группы: архитектура микросервисов на Go"
  ],
  [
    129,
    142,
    35,
    0,
    "14:30",
    "16:00",
    "active",
    "Хакатон: подготовка финального питча и технической демонстрации"
  ],
  [
    130,
    143,
    55,
    1,
    "12:00",
    "13:30",
    "active",
    "Лекция приглашённого профессора по квантовым вычислениям и кубитам"
  ],
  [
    131,
    144,
    49,
    0,
    "13:30",
    "15:00",
    "active",
    "Практическое занятие по компьютерной графике, OpenGL и шейдерам"
  ],
  [
    132,
    145,
    9,
    1,
    "15:30",
    "17:00",
    "active",
    "Встреча академического куратора со старостами и первокурсниками"
  ],
  [
    133,
    146,
    3,
    0,
    "16:00",
    "17:30",
    "active",
    "Научный семинар: нейроморфные процессоры и спайковые нейронные сети"
  ],
  [
    134,
    147,
    23,
    1,
    "11:00",
    "12:30",
    "active",
    "Собрание экологического и туристического клуба университета"
  ],
  [
    135,
    148,
    17,
    0,
    "14:00",
    "16:00",
    "active",
    "Защита лабораторных работ по параллельным и распределённым вычислениям"
  ],
  [
    136,
    149,
    37,
    1,
    "14:30",
    "16:00",
    "active",
    "Отработка пропущенных лабораторных занятий по материаловедению"
  ],
  [
    137,
    150,
    31,
    0,
    "09:00",
    "10:30",
    "active",
    "Интеллектуальная игра Что? Где? Когда? среди студенческих команд"
  ],
  [
    138,
    151,
    51,
    1,
    "13:30",
    "15:00",
    "active",
    "Скрининг резюме и серия пробных технических собеседований для выпускников"
  ],
  [
    139,
    152,
    45,
    0,
    "14:00",
    "15:30",
    "active",
    "Семинар: архитектурные паттерны масштабируемых фронтенд-приложений"
  ],
  [
    140,
    153,
    5,
    1,
    "16:00",
    "17:30",
    "active",
    "Заседание студсовета: распределение путёвок и материальной помощи"
  ],
  [
    141,
    154,
    59,
    0,
    "16:30",
    "18:00",
    "active",
    "Вводная лекция по встраиваемым системам и микроконтроллерам STM32"
  ],
  [
    142,
    155,
    19,
    1,
    "14:00",
    "16:00",
    "active",
    "Проведение университетского отборочного этапа Всероссийской олимпиады"
  ],
  [
    143,
    156,
    13,
    0,
    "11:30",
    "13:00",
    "active",
    "Лабораторный практикум по реляционным базам данных"
  ],
  [
    144,
    157,
    33,
    1,
    "09:00",
    "10:30",
    "active",
    "Лекция: Архитектура микропроцессоров и низкоуровневое программирование"
  ],
  [
    145,
    158,
    27,
    0,
    "10:30",
    "12:00",
    "active",
    "Семинар по математическому анализу: кратные интегралы и ряды"
  ],
  [
    146,
    159,
    47,
    1,
    "14:00",
    "15:30",
    "active",
    "Практикум по алгоритмам и структурам данных на современном C++"
  ],
  [
    147,
    160,
    41,
    0,
    "15:00",
    "16:30",
    "active",
    "Командный созвон хакатон-команды по веб-разработке"
  ],
  [
    148,
    161,
    1,
    1,
    "16:30",
    "18:00",
    "active",
    "Заседание студенческого научного общества ФИСТ"
  ],
  [
    149,
    162,
    55,
    0,
    "09:30",
    "11:00",
    "active",
    "Репетиция доклада на международную научно-практическую конференцию"
  ],
  [
    150,
    163,
    15,
    1,
    "11:30",
    "13:00",
    "active",
    "Защита курсового проекта по сетям и телекоммуникациям"
  ],
  [
    151,
    164,
    9,
    0,
    "13:00",
    "14:30",
    "active",
    "Консультация перед рубежным контролем по дифференциальным уравнениям"
  ],
  [
    152,
    165,
    29,
    1,
    "10:30",
    "12:00",
    "active",
    "Воркшоп по введению в глубокое обучение и библиотеки PyTorch"
  ],
  [
    153,
    166,
    23,
    0,
    "12:00",
    "13:30",
    "active",
    "Собрание старостата факультета информационных технологий"
  ],
  [
    154,
    167,
    43,
    1,
    "15:00",
    "16:30",
    "active",
    "Занятие кружка олимпиадного программирования ACM ICPC"
  ],
  [
    155,
    168,
    37,
    0,
    "15:30",
    "17:00",
    "active",
    "Мастер-класс по проектированию пользовательских интерфейсов в Figma"
  ],
  [
    156,
    169,
    57,
    1,
    "09:30",
    "11:00",
    "active",
    "Лабораторная работа: сетевые протоколы, маршрутизация и BGP"
  ],
  [
    157,
    170,
    51,
    0,
    "11:00",
    "12:30",
    "active",
    "Встреча с техническим директором IT-компании: стажировки и карьера"
  ],
  [
    158,
    171,
    11,
    1,
    "13:00",
    "14:30",
    "active",
    "Коллоквиум по дискретной математике, комбинаторике и теории графов"
  ],
  [
    159,
    172,
    5,
    0,
    "14:30",
    "16:00",
    "active",
    "Собеседование в студенческую лабораторию искусственного интеллекта"
  ],
  [
    160,
    173,
    25,
    1,
    "12:00",
    "13:30",
    "active",
    "Семинар кафедры: предзащита кандидатских диссертаций"
  ],
  [
    161,
    174,
    19,
    0,
    "13:30",
    "15:00",
    "active",
    "Репетиция творческого коллектива к праздничному концерту студвесны"
  ],
  [
    162,
    175,
    39,
    1,
    "15:30",
    "17:00",
    "active",
    "Тестирование производительности и аудит безопасности веб-сервиса"
  ],
  [
    163,
    176,
    33,
    0,
    "16:00",
    "17:30",
    "active",
    "Заседание учебно-методической комиссии факультета"
  ],
  [
    164,
    177,
    53,
    1,
    "11:00",
    "12:30",
    "active",
    "Практикум по операционным системам: потоки, мьютексы и межпроцессное взаимодействие"
  ],
  [
    165,
    178,
    47,
    0,
    "14:00",
    "16:00",
    "active",
    "Организационное собрание волонтёрского корпуса университета"
  ],
  [
    166,
    179,
    7,
    1,
    "14:30",
    "16:00",
    "active",
    "Семинар по физике полупроводников: наноструктуры и квантовая оптика"
  ],
  [
    167,
    180,
    1,
    0,
    "09:00",
    "10:30",
    "active",
    "Презентация выпускных квалификационных работ бакалавров"
  ],
  [
    168,
    181,
    21,
    1,
    "13:30",
    "15:00",
    "active",
    "Консультация для студентов по линейной алгебре и аналитической геометрии"
  ],
  [
    169,
    182,
    15,
    0,
    "14:00",
    "15:30",
    "active",
    "Турнир университетской киберспортивной лиги по дисциплине Dota 2"
  ],
  [
    170,
    183,
    35,
    1,
    "16:00",
    "17:30",
    "active",
    "Лабораторная работа по криптографическим алгоритмам и шифрованию данных"
  ],
  [
    171,
    184,
    29,
    0,
    "16:30",
    "18:00",
    "active",
    "Круглый стол: этика применения генеративных моделей в образовании"
  ],
  [
    172,
    185,
    49,
    1,
    "14:00",
    "16:00",
    "active",
    "Практическое занятие по профессиональному английскому для инженеров"
  ],
  [
    173,
    186,
    43,
    0,
    "11:30",
    "13:00",
    "active",
    "Собрание проектной группы: архитектура микросервисов на Go"
  ],
  [
    174,
    187,
    3,
    1,
    "09:00",
    "10:30",
    "active",
    "Хакатон: подготовка финального питча и технической демонстрации"
  ],
  [
    175,
    188,
    57,
    0,
    "10:30",
    "12:00",
    "active",
    "Лекция приглашённого профессора по квантовым вычислениям и кубитам"
  ],
  [
    176,
    189,
    17,
    1,
    "14:00",
    "15:30",
    "active",
    "Практическое занятие по компьютерной графике, OpenGL и шейдерам"
  ],
  [
    177,
    190,
    11,
    0,
    "15:00",
    "16:30",
    "active",
    "Встреча академического куратора со старостами и первокурсниками"
  ],
  [
    178,
    191,
    31,
    1,
    "16:30",
    "18:00",
    "active",
    "Научный семинар: нейроморфные процессоры и спайковые нейронные сети"
  ],
  [
    179,
    207,
    10,
    0,
    "09:30",
    "11:00",
    "active",
    "Собрание экологического и туристического клуба университета"
  ],
  [
    180,
    208,
    30,
    1,
    "11:30",
    "13:00",
    "active",
    "Защита лабораторных работ по параллельным и распределённым вычислениям"
  ],
  [
    181,
    209,
    24,
    0,
    "13:00",
    "14:30",
    "active",
    "Отработка пропущенных лабораторных занятий по материаловедению"
  ],
  [
    182,
    210,
    44,
    1,
    "10:30",
    "12:00",
    "active",
    "Интеллектуальная игра Что? Где? Когда? среди студенческих команд"
  ],
  [
    183,
    211,
    38,
    0,
    "12:00",
    "13:30",
    "active",
    "Скрининг резюме и серия пробных технических собеседований для выпускников"
  ],
  [
    184,
    212,
    58,
    1,
    "15:00",
    "16:30",
    "active",
    "Семинар: архитектурные паттерны масштабируемых фронтенд-приложений"
  ],
  [
    185,
    213,
    52,
    0,
    "15:30",
    "17:00",
    "active",
    "Заседание студсовета: распределение путёвок и материальной помощи"
  ],
  [
    186,
    214,
    12,
    1,
    "09:30",
    "11:00",
    "active",
    "Вводная лекция по встраиваемым системам и микроконтроллерам STM32"
  ],
  [
    187,
    215,
    6,
    0,
    "11:00",
    "12:30",
    "active",
    "Проведение университетского отборочного этапа Всероссийской олимпиады"
  ],
  [
    188,
    216,
    26,
    1,
    "13:00",
    "14:30",
    "active",
    "Лабораторный практикум по реляционным базам данных"
  ],
  [
    189,
    217,
    20,
    0,
    "14:30",
    "16:00",
    "active",
    "Лекция: Архитектура микропроцессоров и низкоуровневое программирование"
  ],
  [
    190,
    218,
    40,
    1,
    "12:00",
    "13:30",
    "active",
    "Семинар по математическому анализу: кратные интегралы и ряды"
  ],
  [
    191,
    219,
    34,
    0,
    "13:30",
    "15:00",
    "active",
    "Практикум по алгоритмам и структурам данных на современном C++"
  ],
  [
    192,
    220,
    54,
    1,
    "15:30",
    "17:00",
    "active",
    "Командный созвон хакатон-команды по веб-разработке"
  ],
  [
    193,
    221,
    48,
    0,
    "16:00",
    "17:30",
    "active",
    "Заседание студенческого научного общества ФИСТ"
  ],
  [
    194,
    222,
    8,
    1,
    "11:00",
    "12:30",
    "active",
    "Репетиция доклада на международную научно-практическую конференцию"
  ],
  [
    195,
    223,
    2,
    0,
    "14:00",
    "16:00",
    "active",
    "Защита курсового проекта по сетям и телекоммуникациям"
  ],
  [
    196,
    224,
    22,
    1,
    "14:30",
    "16:00",
    "active",
    "Консультация перед рубежным контролем по дифференциальным уравнениям"
  ],
  [
    197,
    225,
    16,
    0,
    "09:00",
    "10:30",
    "active",
    "Воркшоп по введению в глубокое обучение и библиотеки PyTorch"
  ],
  [
    198,
    226,
    36,
    1,
    "13:30",
    "15:00",
    "active",
    "Собрание старостата факультета информационных технологий"
  ],
  [
    199,
    227,
    30,
    0,
    "14:00",
    "15:30",
    "active",
    "Занятие кружка олимпиадного программирования ACM ICPC"
  ],
  [
    200,
    228,
    50,
    1,
    "16:00",
    "17:30",
    "active",
    "Мастер-класс по проектированию пользовательских интерфейсов в Figma"
  ],
  [
    201,
    229,
    44,
    0,
    "16:30",
    "18:00",
    "active",
    "Лабораторная работа: сетевые протоколы, маршрутизация и BGP"
  ],
  [
    202,
    230,
    4,
    1,
    "14:00",
    "16:00",
    "active",
    "Встреча с техническим директором IT-компании: стажировки и карьера"
  ],
  [
    203,
    231,
    58,
    0,
    "11:30",
    "13:00",
    "active",
    "Коллоквиум по дискретной математике, комбинаторике и теории графов"
  ],
  [
    204,
    232,
    18,
    1,
    "09:00",
    "10:30",
    "active",
    "Собеседование в студенческую лабораторию искусственного интеллекта"
  ],
  [
    205,
    233,
    12,
    0,
    "10:30",
    "12:00",
    "active",
    "Семинар кафедры: предзащита кандидатских диссертаций"
  ],
  [
    206,
    234,
    32,
    1,
    "14:00",
    "15:30",
    "active",
    "Репетиция творческого коллектива к праздничному концерту студвесны"
  ],
  [
    207,
    235,
    26,
    0,
    "15:00",
    "16:30",
    "active",
    "Тестирование производительности и аудит безопасности веб-сервиса"
  ],
  [
    208,
    236,
    46,
    1,
    "16:30",
    "18:00",
    "active",
    "Заседание учебно-методической комиссии факультета"
  ],
  [
    209,
    237,
    40,
    0,
    "09:30",
    "11:00",
    "active",
    "Практикум по операционным системам: потоки, мьютексы и межпроцессное взаимодействие"
  ],
  [
    210,
    238,
    60,
    1,
    "11:30",
    "13:00",
    "active",
    "Организационное собрание волонтёрского корпуса университета"
  ],
  [
    211,
    239,
    54,
    0,
    "13:00",
    "14:30",
    "active",
    "Семинар по физике полупроводников: наноструктуры и квантовая оптика"
  ],
  [
    212,
    240,
    14,
    1,
    "10:30",
    "12:00",
    "active",
    "Презентация выпускных квалификационных работ бакалавров"
  ],
  [
    213,
    241,
    8,
    0,
    "12:00",
    "13:30",
    "active",
    "Консультация для студентов по линейной алгебре и аналитической геометрии"
  ],
  [
    214,
    242,
    28,
    1,
    "15:00",
    "16:30",
    "active",
    "Турнир университетской киберспортивной лиги по дисциплине Dota 2"
  ],
  [
    215,
    243,
    22,
    0,
    "15:30",
    "17:00",
    "active",
    "Лабораторная работа по криптографическим алгоритмам и шифрованию данных"
  ],
  [
    216,
    244,
    42,
    1,
    "09:30",
    "11:00",
    "active",
    "Круглый стол: этика применения генеративных моделей в образовании"
  ],
  [
    217,
    245,
    36,
    0,
    "11:00",
    "12:30",
    "active",
    "Практическое занятие по профессиональному английскому для инженеров"
  ],
  [
    218,
    246,
    56,
    1,
    "13:00",
    "14:30",
    "active",
    "Собрание проектной группы: архитектура микросервисов на Go"
  ],
  [
    219,
    247,
    50,
    0,
    "14:30",
    "16:00",
    "active",
    "Хакатон: подготовка финального питча и технической демонстрации"
  ],
  [
    220,
    248,
    10,
    1,
    "12:00",
    "13:30",
    "active",
    "Лекция приглашённого профессора по квантовым вычислениям и кубитам"
  ],
  [
    221,
    249,
    4,
    0,
    "13:30",
    "15:00",
    "active",
    "Практическое занятие по компьютерной графике, OpenGL и шейдерам"
  ],
  [
    222,
    250,
    24,
    1,
    "15:30",
    "17:00",
    "active",
    "Встреча академического куратора со старостами и первокурсниками"
  ],
  [
    223,
    251,
    18,
    0,
    "16:00",
    "17:30",
    "active",
    "Научный семинар: нейроморфные процессоры и спайковые нейронные сети"
  ],
  [
    224,
    252,
    38,
    1,
    "11:00",
    "12:30",
    "active",
    "Собрание экологического и туристического клуба университета"
  ],
  [
    225,
    253,
    32,
    0,
    "14:00",
    "16:00",
    "active",
    "Защита лабораторных работ по параллельным и распределённым вычислениям"
  ],
  [
    226,
    254,
    52,
    1,
    "14:30",
    "16:00",
    "active",
    "Отработка пропущенных лабораторных занятий по материаловедению"
  ],
  [
    227,
    255,
    46,
    0,
    "09:00",
    "10:30",
    "active",
    "Интеллектуальная игра Что? Где? Когда? среди студенческих команд"
  ],
  [
    228,
    256,
    6,
    1,
    "13:30",
    "15:00",
    "active",
    "Скрининг резюме и серия пробных технических собеседований для выпускников"
  ],
  [
    229,
    257,
    60,
    0,
    "14:00",
    "15:30",
    "active",
    "Семинар: архитектурные паттерны масштабируемых фронтенд-приложений"
  ],
  [
    230,
    258,
    20,
    1,
    "16:00",
    "17:30",
    "active",
    "Заседание студсовета: распределение путёвок и материальной помощи"
  ],
  [
    231,
    259,
    14,
    0,
    "16:30",
    "18:00",
    "active",
    "Вводная лекция по встраиваемым системам и микроконтроллерам STM32"
  ],
  [
    232,
    260,
    34,
    1,
    "14:00",
    "16:00",
    "active",
    "Проведение университетского отборочного этапа Всероссийской олимпиады"
  ],
  [
    233,
    261,
    28,
    0,
    "11:30",
    "13:00",
    "active",
    "Лабораторный практикум по реляционным базам данных"
  ],
  [
    234,
    262,
    48,
    1,
    "09:00",
    "10:30",
    "active",
    "Лекция: Архитектура микропроцессоров и низкоуровневое программирование"
  ],
  [
    235,
    263,
    42,
    0,
    "10:30",
    "12:00",
    "active",
    "Семинар по математическому анализу: кратные интегралы и ряды"
  ],
  [
    236,
    264,
    2,
    1,
    "14:00",
    "15:30",
    "active",
    "Практикум по алгоритмам и структурам данных на современном C++"
  ],
  [
    237,
    265,
    56,
    0,
    "15:00",
    "16:30",
    "active",
    "Командный созвон хакатон-команды по веб-разработке"
  ],
  [
    238,
    266,
    16,
    1,
    "16:30",
    "18:00",
    "active",
    "Заседание студенческого научного общества ФИСТ"
  ],
  [
    239,
    267,
    10,
    0,
    "09:30",
    "11:00",
    "active",
    "Репетиция доклада на международную научно-практическую конференцию"
  ],
  [
    240,
    268,
    30,
    1,
    "11:30",
    "13:00",
    "active",
    "Защита курсового проекта по сетям и телекоммуникациям"
  ],
  [
    241,
    269,
    24,
    0,
    "13:00",
    "14:30",
    "active",
    "Консультация перед рубежным контролем по дифференциальным уравнениям"
  ],
  [
    242,
    270,
    44,
    1,
    "10:30",
    "12:00",
    "active",
    "Воркшоп по введению в глубокое обучение и библиотеки PyTorch"
  ],
  [
    243,
    271,
    38,
    0,
    "12:00",
    "13:30",
    "active",
    "Собрание старостата факультета информационных технологий"
  ],
  [
    244,
    272,
    58,
    1,
    "15:00",
    "16:30",
    "active",
    "Занятие кружка олимпиадного программирования ACM ICPC"
  ],
  [
    245,
    273,
    52,
    0,
    "15:30",
    "17:00",
    "active",
    "Мастер-класс по проектированию пользовательских интерфейсов в Figma"
  ],
  [
    246,
    274,
    12,
    1,
    "09:30",
    "11:00",
    "active",
    "Лабораторная работа: сетевые протоколы, маршрутизация и BGP"
  ],
  [
    247,
    275,
    6,
    0,
    "11:00",
    "12:30",
    "active",
    "Встреча с техническим директором IT-компании: стажировки и карьера"
  ],
  [
    248,
    276,
    26,
    1,
    "13:00",
    "14:30",
    "active",
    "Коллоквиум по дискретной математике, комбинаторике и теории графов"
  ],
  [
    249,
    277,
    20,
    0,
    "14:30",
    "16:00",
    "active",
    "Собеседование в студенческую лабораторию искусственного интеллекта"
  ],
  [
    250,
    278,
    40,
    1,
    "12:00",
    "13:30",
    "active",
    "Семинар кафедры: предзащита кандидатских диссертаций"
  ],
  [
    251,
    279,
    34,
    0,
    "13:30",
    "15:00",
    "active",
    "Репетиция творческого коллектива к праздничному концерту студвесны"
  ],
  [
    252,
    280,
    54,
    1,
    "15:30",
    "17:00",
    "active",
    "Тестирование производительности и аудит безопасности веб-сервиса"
  ],
  [
    253,
    281,
    48,
    0,
    "16:00",
    "17:30",
    "active",
    "Заседание учебно-методической комиссии факультета"
  ],
  [
    254,
    282,
    8,
    1,
    "11:00",
    "12:30",
    "active",
    "Практикум по операционным системам: потоки, мьютексы и межпроцессное взаимодействие"
  ],
  [
    255,
    283,
    2,
    0,
    "14:00",
    "16:00",
    "active",
    "Организационное собрание волонтёрского корпуса университета"
  ],
  [
    256,
    284,
    22,
    1,
    "14:30",
    "16:00",
    "active",
    "Семинар по физике полупроводников: наноструктуры и квантовая оптика"
  ],
  [
    257,
    285,
    16,
    0,
    "09:00",
    "10:30",
    "active",
    "Презентация выпускных квалификационных работ бакалавров"
  ],
  [
    258,
    286,
    36,
    1,
    "13:30",
    "15:00",
    "active",
    "Консультация для студентов по линейной алгебре и аналитической геометрии"
  ],
  [
    259,
    287,
    30,
    0,
    "14:00",
    "15:30",
    "active",
    "Турнир университетской киберспортивной лиги по дисциплине Dota 2"
  ],
  [
    260,
    288,
    50,
    1,
    "16:00",
    "17:30",
    "active",
    "Лабораторная работа по криптографическим алгоритмам и шифрованию данных"
  ],
  [
    261,
    304,
    29,
    0,
    "16:30",
    "18:00",
    "active",
    "Круглый стол: этика применения генеративных моделей в образовании"
  ],
  [
    262,
    305,
    49,
    1,
    "14:00",
    "16:00",
    "active",
    "Практическое занятие по профессиональному английскому для инженеров"
  ],
  [
    263,
    306,
    43,
    0,
    "11:30",
    "13:00",
    "active",
    "Собрание проектной группы: архитектура микросервисов на Go"
  ],
  [
    264,
    307,
    3,
    1,
    "09:00",
    "10:30",
    "active",
    "Хакатон: подготовка финального питча и технической демонстрации"
  ],
  [
    265,
    308,
    57,
    0,
    "10:30",
    "12:00",
    "active",
    "Лекция приглашённого профессора по квантовым вычислениям и кубитам"
  ],
  [
    266,
    309,
    17,
    1,
    "14:00",
    "15:30",
    "active",
    "Практическое занятие по компьютерной графике, OpenGL и шейдерам"
  ],
  [
    267,
    310,
    11,
    0,
    "15:00",
    "16:30",
    "active",
    "Встреча академического куратора со старостами и первокурсниками"
  ],
  [
    268,
    311,
    31,
    1,
    "16:30",
    "18:00",
    "active",
    "Научный семинар: нейроморфные процессоры и спайковые нейронные сети"
  ],
  [
    269,
    312,
    25,
    0,
    "09:30",
    "11:00",
    "active",
    "Собрание экологического и туристического клуба университета"
  ],
  [
    270,
    313,
    45,
    1,
    "11:30",
    "13:00",
    "active",
    "Защита лабораторных работ по параллельным и распределённым вычислениям"
  ],
  [
    271,
    314,
    39,
    0,
    "13:00",
    "14:30",
    "active",
    "Отработка пропущенных лабораторных занятий по материаловедению"
  ],
  [
    272,
    315,
    59,
    1,
    "10:30",
    "12:00",
    "active",
    "Интеллектуальная игра Что? Где? Когда? среди студенческих команд"
  ],
  [
    273,
    316,
    53,
    0,
    "12:00",
    "13:30",
    "active",
    "Скрининг резюме и серия пробных технических собеседований для выпускников"
  ],
  [
    274,
    317,
    13,
    1,
    "15:00",
    "16:30",
    "active",
    "Семинар: архитектурные паттерны масштабируемых фронтенд-приложений"
  ],
  [
    275,
    318,
    7,
    0,
    "15:30",
    "17:00",
    "active",
    "Заседание студсовета: распределение путёвок и материальной помощи"
  ],
  [
    276,
    319,
    27,
    1,
    "09:30",
    "11:00",
    "active",
    "Вводная лекция по встраиваемым системам и микроконтроллерам STM32"
  ],
  [
    277,
    320,
    21,
    0,
    "11:00",
    "12:30",
    "active",
    "Проведение университетского отборочного этапа Всероссийской олимпиады"
  ],
  [
    278,
    321,
    41,
    1,
    "13:00",
    "14:30",
    "active",
    "Лабораторный практикум по реляционным базам данных"
  ],
  [
    279,
    322,
    35,
    0,
    "14:30",
    "16:00",
    "active",
    "Лекция: Архитектура микропроцессоров и низкоуровневое программирование"
  ],
  [
    280,
    323,
    55,
    1,
    "12:00",
    "13:30",
    "active",
    "Семинар по математическому анализу: кратные интегралы и ряды"
  ],
  [
    281,
    324,
    49,
    0,
    "13:30",
    "15:00",
    "active",
    "Практикум по алгоритмам и структурам данных на современном C++"
  ],
  [
    282,
    325,
    9,
    1,
    "15:30",
    "17:00",
    "active",
    "Командный созвон хакатон-команды по веб-разработке"
  ],
  [
    283,
    326,
    3,
    0,
    "16:00",
    "17:30",
    "active",
    "Заседание студенческого научного общества ФИСТ"
  ],
  [
    284,
    327,
    23,
    1,
    "11:00",
    "12:30",
    "active",
    "Репетиция доклада на международную научно-практическую конференцию"
  ],
  [
    285,
    328,
    17,
    0,
    "14:00",
    "16:00",
    "active",
    "Защита курсового проекта по сетям и телекоммуникациям"
  ],
  [
    286,
    329,
    37,
    1,
    "14:30",
    "16:00",
    "active",
    "Консультация перед рубежным контролем по дифференциальным уравнениям"
  ],
  [
    287,
    330,
    31,
    0,
    "09:00",
    "10:30",
    "active",
    "Воркшоп по введению в глубокое обучение и библиотеки PyTorch"
  ],
  [
    288,
    331,
    51,
    1,
    "13:30",
    "15:00",
    "active",
    "Собрание старостата факультета информационных технологий"
  ],
  [
    289,
    332,
    45,
    0,
    "14:00",
    "15:30",
    "active",
    "Занятие кружка олимпиадного программирования ACM ICPC"
  ],
  [
    290,
    333,
    5,
    1,
    "16:00",
    "17:30",
    "active",
    "Мастер-класс по проектированию пользовательских интерфейсов в Figma"
  ],
  [
    291,
    334,
    59,
    0,
    "16:30",
    "18:00",
    "active",
    "Лабораторная работа: сетевые протоколы, маршрутизация и BGP"
  ],
  [
    292,
    335,
    19,
    1,
    "14:00",
    "16:00",
    "active",
    "Встреча с техническим директором IT-компании: стажировки и карьера"
  ],
  [
    293,
    336,
    13,
    0,
    "11:30",
    "13:00",
    "active",
    "Коллоквиум по дискретной математике, комбинаторике и теории графов"
  ],
  [
    294,
    337,
    33,
    1,
    "09:00",
    "10:30",
    "active",
    "Собеседование в студенческую лабораторию искусственного интеллекта"
  ],
  [
    295,
    338,
    27,
    0,
    "10:30",
    "12:00",
    "active",
    "Семинар кафедры: предзащита кандидатских диссертаций"
  ],
  [
    296,
    339,
    47,
    1,
    "14:00",
    "15:30",
    "active",
    "Репетиция творческого коллектива к праздничному концерту студвесны"
  ],
  [
    297,
    340,
    41,
    0,
    "15:00",
    "16:30",
    "active",
    "Тестирование производительности и аудит безопасности веб-сервиса"
  ],
  [
    298,
    341,
    1,
    1,
    "16:30",
    "18:00",
    "active",
    "Заседание учебно-методической комиссии факультета"
  ],
  [
    299,
    342,
    55,
    0,
    "09:30",
    "11:00",
    "active",
    "Практикум по операционным системам: потоки, мьютексы и межпроцессное взаимодействие"
  ],
  [
    300,
    343,
    15,
    1,
    "11:30",
    "13:00",
    "active",
    "Организационное собрание волонтёрского корпуса университета"
  ],
  [
    301,
    344,
    9,
    0,
    "13:00",
    "14:30",
    "active",
    "Семинар по физике полупроводников: наноструктуры и квантовая оптика"
  ],
  [
    302,
    345,
    29,
    1,
    "10:30",
    "12:00",
    "active",
    "Презентация выпускных квалификационных работ бакалавров"
  ],
  [
    303,
    346,
    23,
    0,
    "12:00",
    "13:30",
    "active",
    "Консультация для студентов по линейной алгебре и аналитической геометрии"
  ],
  [
    304,
    347,
    43,
    1,
    "15:00",
    "16:30",
    "active",
    "Турнир университетской киберспортивной лиги по дисциплине Dota 2"
  ],
  [
    305,
    348,
    37,
    0,
    "15:30",
    "17:00",
    "active",
    "Лабораторная работа по криптографическим алгоритмам и шифрованию данных"
  ],
  [
    306,
    349,
    57,
    1,
    "09:30",
    "11:00",
    "active",
    "Круглый стол: этика применения генеративных моделей в образовании"
  ],
  [
    307,
    350,
    51,
    0,
    "11:00",
    "12:30",
    "active",
    "Практическое занятие по профессиональному английскому для инженеров"
  ],
  [
    308,
    351,
    11,
    1,
    "13:00",
    "14:30",
    "active",
    "Собрание проектной группы: архитектура микросервисов на Go"
  ],
  [
    309,
    352,
    5,
    0,
    "14:30",
    "16:00",
    "active",
    "Хакатон: подготовка финального питча и технической демонстрации"
  ],
  [
    310,
    353,
    25,
    1,
    "12:00",
    "13:30",
    "active",
    "Лекция приглашённого профессора по квантовым вычислениям и кубитам"
  ],
  [
    311,
    354,
    19,
    0,
    "13:30",
    "15:00",
    "active",
    "Практическое занятие по компьютерной графике, OpenGL и шейдерам"
  ],
  [
    312,
    355,
    39,
    1,
    "15:30",
    "17:00",
    "active",
    "Встреча академического куратора со старостами и первокурсниками"
  ],
  [
    313,
    356,
    33,
    0,
    "16:00",
    "17:30",
    "active",
    "Научный семинар: нейроморфные процессоры и спайковые нейронные сети"
  ],
  [
    314,
    357,
    53,
    1,
    "11:00",
    "12:30",
    "active",
    "Собрание экологического и туристического клуба университета"
  ],
  [
    315,
    358,
    47,
    0,
    "14:00",
    "16:00",
    "active",
    "Защита лабораторных работ по параллельным и распределённым вычислениям"
  ],
  [
    316,
    359,
    7,
    1,
    "14:30",
    "16:00",
    "active",
    "Отработка пропущенных лабораторных занятий по материаловедению"
  ],
  [
    317,
    360,
    1,
    0,
    "09:00",
    "10:30",
    "active",
    "Интеллектуальная игра Что? Где? Когда? среди студенческих команд"
  ],
  [
    318,
    361,
    21,
    1,
    "13:30",
    "15:00",
    "active",
    "Скрининг резюме и серия пробных технических собеседований для выпускников"
  ],
  [
    319,
    362,
    15,
    0,
    "14:00",
    "15:30",
    "active",
    "Семинар: архитектурные паттерны масштабируемых фронтенд-приложений"
  ],
  [
    320,
    363,
    35,
    1,
    "16:00",
    "17:30",
    "active",
    "Заседание студсовета: распределение путёвок и материальной помощи"
  ],
  [
    321,
    364,
    29,
    0,
    "16:30",
    "18:00",
    "active",
    "Вводная лекция по встраиваемым системам и микроконтроллерам STM32"
  ],
  [
    322,
    365,
    49,
    1,
    "14:00",
    "16:00",
    "active",
    "Проведение университетского отборочного этапа Всероссийской олимпиады"
  ],
  [
    323,
    366,
    43,
    0,
    "11:30",
    "13:00",
    "active",
    "Лабораторный практикум по реляционным базам данных"
  ],
  [
    324,
    367,
    3,
    1,
    "09:00",
    "10:30",
    "active",
    "Лекция: Архитектура микропроцессоров и низкоуровневое программирование"
  ],
  [
    325,
    368,
    57,
    0,
    "10:30",
    "12:00",
    "active",
    "Семинар по математическому анализу: кратные интегралы и ряды"
  ],
  [
    326,
    369,
    17,
    1,
    "14:00",
    "15:30",
    "active",
    "Практикум по алгоритмам и структурам данных на современном C++"
  ],
  [
    327,
    370,
    11,
    0,
    "15:00",
    "16:30",
    "active",
    "Командный созвон хакатон-команды по веб-разработке"
  ],
  [
    328,
    371,
    31,
    1,
    "16:30",
    "18:00",
    "active",
    "Заседание студенческого научного общества ФИСТ"
  ],
  [
    329,
    372,
    25,
    0,
    "09:30",
    "11:00",
    "active",
    "Репетиция доклада на международную научно-практическую конференцию"
  ],
  [
    330,
    373,
    45,
    1,
    "11:30",
    "13:00",
    "active",
    "Защита курсового проекта по сетям и телекоммуникациям"
  ],
  [
    331,
    374,
    39,
    0,
    "13:00",
    "14:30",
    "active",
    "Консультация перед рубежным контролем по дифференциальным уравнениям"
  ],
  [
    332,
    375,
    59,
    1,
    "10:30",
    "12:00",
    "active",
    "Воркшоп по введению в глубокое обучение и библиотеки PyTorch"
  ],
  [
    333,
    376,
    53,
    0,
    "12:00",
    "13:30",
    "active",
    "Собрание старостата факультета информационных технологий"
  ],
  [
    334,
    377,
    13,
    1,
    "15:00",
    "16:30",
    "active",
    "Занятие кружка олимпиадного программирования ACM ICPC"
  ],
  [
    335,
    378,
    7,
    0,
    "15:30",
    "17:00",
    "active",
    "Мастер-класс по проектированию пользовательских интерфейсов в Figma"
  ],
  [
    336,
    379,
    27,
    1,
    "09:30",
    "11:00",
    "active",
    "Лабораторная работа: сетевые протоколы, маршрутизация и BGP"
  ],
  [
    337,
    380,
    21,
    0,
    "11:00",
    "12:30",
    "active",
    "Встреча с техническим директором IT-компании: стажировки и карьера"
  ],
  [
    338,
    381,
    41,
    1,
    "13:00",
    "14:30",
    "active",
    "Коллоквиум по дискретной математике, комбинаторике и теории графов"
  ],
  [
    339,
    382,
    35,
    0,
    "14:30",
    "16:00",
    "active",
    "Собеседование в студенческую лабораторию искусственного интеллекта"
  ],
  [
    340,
    383,
    55,
    1,
    "12:00",
    "13:30",
    "active",
    "Семинар кафедры: предзащита кандидатских диссертаций"
  ],
  [
    341,
    384,
    49,
    0,
    "13:30",
    "15:00",
    "active",
    "Репетиция творческого коллектива к праздничному концерту студвесны"
  ],
  [
    342,
    385,
    9,
    1,
    "15:30",
    "17:00",
    "active",
    "Тестирование производительности и аудит безопасности веб-сервиса"
  ],
  [
    343,
    401,
    48,
    0,
    "16:00",
    "17:30",
    "active",
    "Заседание учебно-методической комиссии факультета"
  ],
  [
    344,
    402,
    8,
    1,
    "11:00",
    "12:30",
    "active",
    "Практикум по операционным системам: потоки, мьютексы и межпроцессное взаимодействие"
  ],
  [
    345,
    403,
    2,
    0,
    "14:00",
    "16:00",
    "active",
    "Организационное собрание волонтёрского корпуса университета"
  ],
  [
    346,
    404,
    22,
    1,
    "14:30",
    "16:00",
    "active",
    "Семинар по физике полупроводников: наноструктуры и квантовая оптика"
  ],
  [
    347,
    405,
    16,
    0,
    "09:00",
    "10:30",
    "active",
    "Презентация выпускных квалификационных работ бакалавров"
  ],
  [
    348,
    406,
    36,
    1,
    "13:30",
    "15:00",
    "active",
    "Консультация для студентов по линейной алгебре и аналитической геометрии"
  ],
  [
    349,
    407,
    30,
    0,
    "14:00",
    "15:30",
    "active",
    "Турнир университетской киберспортивной лиги по дисциплине Dota 2"
  ],
  [
    350,
    408,
    50,
    1,
    "16:00",
    "17:30",
    "active",
    "Лабораторная работа по криптографическим алгоритмам и шифрованию данных"
  ],
  [
    351,
    409,
    44,
    0,
    "16:30",
    "18:00",
    "active",
    "Круглый стол: этика применения генеративных моделей в образовании"
  ],
  [
    352,
    410,
    4,
    1,
    "14:00",
    "16:00",
    "active",
    "Практическое занятие по профессиональному английскому для инженеров"
  ],
  [
    353,
    411,
    58,
    0,
    "11:30",
    "13:00",
    "active",
    "Собрание проектной группы: архитектура микросервисов на Go"
  ],
  [
    354,
    412,
    18,
    1,
    "09:00",
    "10:30",
    "active",
    "Хакатон: подготовка финального питча и технической демонстрации"
  ],
  [
    355,
    413,
    12,
    0,
    "10:30",
    "12:00",
    "active",
    "Лекция приглашённого профессора по квантовым вычислениям и кубитам"
  ],
  [
    356,
    414,
    32,
    1,
    "14:00",
    "15:30",
    "active",
    "Практическое занятие по компьютерной графике, OpenGL и шейдерам"
  ],
  [
    357,
    415,
    26,
    0,
    "15:00",
    "16:30",
    "active",
    "Встреча академического куратора со старостами и первокурсниками"
  ],
  [
    358,
    416,
    46,
    1,
    "16:30",
    "18:00",
    "active",
    "Научный семинар: нейроморфные процессоры и спайковые нейронные сети"
  ],
  [
    359,
    417,
    40,
    0,
    "09:30",
    "11:00",
    "active",
    "Собрание экологического и туристического клуба университета"
  ],
  [
    360,
    418,
    60,
    1,
    "11:30",
    "13:00",
    "active",
    "Защита лабораторных работ по параллельным и распределённым вычислениям"
  ],
  [
    361,
    419,
    54,
    0,
    "13:00",
    "14:30",
    "active",
    "Отработка пропущенных лабораторных занятий по материаловедению"
  ],
  [
    362,
    420,
    14,
    1,
    "10:30",
    "12:00",
    "active",
    "Интеллектуальная игра Что? Где? Когда? среди студенческих команд"
  ],
  [
    363,
    421,
    8,
    0,
    "12:00",
    "13:30",
    "active",
    "Скрининг резюме и серия пробных технических собеседований для выпускников"
  ],
  [
    364,
    422,
    28,
    1,
    "15:00",
    "16:30",
    "active",
    "Семинар: архитектурные паттерны масштабируемых фронтенд-приложений"
  ],
  [
    365,
    423,
    22,
    0,
    "15:30",
    "17:00",
    "active",
    "Заседание студсовета: распределение путёвок и материальной помощи"
  ],
  [
    366,
    424,
    42,
    1,
    "09:30",
    "11:00",
    "active",
    "Вводная лекция по встраиваемым системам и микроконтроллерам STM32"
  ],
  [
    367,
    425,
    36,
    0,
    "11:00",
    "12:30",
    "active",
    "Проведение университетского отборочного этапа Всероссийской олимпиады"
  ],
  [
    368,
    426,
    56,
    1,
    "13:00",
    "14:30",
    "active",
    "Лабораторный практикум по реляционным базам данных"
  ],
  [
    369,
    427,
    50,
    0,
    "14:30",
    "16:00",
    "active",
    "Лекция: Архитектура микропроцессоров и низкоуровневое программирование"
  ],
  [
    370,
    428,
    10,
    1,
    "12:00",
    "13:30",
    "active",
    "Семинар по математическому анализу: кратные интегралы и ряды"
  ],
  [
    371,
    429,
    4,
    0,
    "13:30",
    "15:00",
    "active",
    "Практикум по алгоритмам и структурам данных на современном C++"
  ],
  [
    372,
    430,
    24,
    1,
    "15:30",
    "17:00",
    "active",
    "Командный созвон хакатон-команды по веб-разработке"
  ],
  [
    373,
    431,
    18,
    0,
    "16:00",
    "17:30",
    "active",
    "Заседание студенческого научного общества ФИСТ"
  ],
  [
    374,
    432,
    38,
    1,
    "11:00",
    "12:30",
    "active",
    "Репетиция доклада на международную научно-практическую конференцию"
  ],
  [
    375,
    433,
    32,
    0,
    "14:00",
    "16:00",
    "active",
    "Защита курсового проекта по сетям и телекоммуникациям"
  ],
  [
    376,
    434,
    52,
    1,
    "14:30",
    "16:00",
    "active",
    "Консультация перед рубежным контролем по дифференциальным уравнениям"
  ],
  [
    377,
    435,
    46,
    0,
    "09:00",
    "10:30",
    "active",
    "Воркшоп по введению в глубокое обучение и библиотеки PyTorch"
  ],
  [
    378,
    436,
    6,
    1,
    "13:30",
    "15:00",
    "active",
    "Собрание старостата факультета информационных технологий"
  ],
  [
    379,
    437,
    60,
    0,
    "14:00",
    "15:30",
    "active",
    "Занятие кружка олимпиадного программирования ACM ICPC"
  ],
  [
    380,
    438,
    20,
    1,
    "16:00",
    "17:30",
    "active",
    "Мастер-класс по проектированию пользовательских интерфейсов в Figma"
  ],
  [
    381,
    439,
    14,
    0,
    "16:30",
    "18:00",
    "active",
    "Лабораторная работа: сетевые протоколы, маршрутизация и BGP"
  ],
  [
    382,
    440,
    34,
    1,
    "14:00",
    "16:00",
    "active",
    "Встреча с техническим директором IT-компании: стажировки и карьера"
  ],
  [
    383,
    441,
    28,
    0,
    "11:30",
    "13:00",
    "active",
    "Коллоквиум по дискретной математике, комбинаторике и теории графов"
  ],
  [
    384,
    442,
    48,
    1,
    "09:00",
    "10:30",
    "active",
    "Собеседование в студенческую лабораторию искусственного интеллекта"
  ],
  [
    385,
    443,
    42,
    0,
    "10:30",
    "12:00",
    "active",
    "Семинар кафедры: предзащита кандидатских диссертаций"
  ],
  [
    386,
    444,
    2,
    1,
    "14:00",
    "15:30",
    "active",
    "Репетиция творческого коллектива к праздничному концерту студвесны"
  ],
  [
    387,
    445,
    56,
    0,
    "15:00",
    "16:30",
    "active",
    "Тестирование производительности и аудит безопасности веб-сервиса"
  ],
  [
    388,
    446,
    16,
    1,
    "16:30",
    "18:00",
    "active",
    "Заседание учебно-методической комиссии факультета"
  ],
  [
    389,
    447,
    10,
    0,
    "09:30",
    "11:00",
    "active",
    "Практикум по операционным системам: потоки, мьютексы и межпроцессное взаимодействие"
  ],
  [
    390,
    448,
    30,
    1,
    "11:30",
    "13:00",
    "active",
    "Организационное собрание волонтёрского корпуса университета"
  ],
  [
    391,
    449,
    24,
    0,
    "13:00",
    "14:30",
    "active",
    "Семинар по физике полупроводников: наноструктуры и квантовая оптика"
  ],
  [
    392,
    450,
    44,
    1,
    "10:30",
    "12:00",
    "active",
    "Презентация выпускных квалификационных работ бакалавров"
  ],
  [
    393,
    451,
    38,
    0,
    "12:00",
    "13:30",
    "active",
    "Консультация для студентов по линейной алгебре и аналитической геометрии"
  ],
  [
    394,
    452,
    58,
    1,
    "15:00",
    "16:30",
    "active",
    "Турнир университетской киберспортивной лиги по дисциплине Dota 2"
  ],
  [
    395,
    453,
    52,
    0,
    "15:30",
    "17:00",
    "active",
    "Лабораторная работа по криптографическим алгоритмам и шифрованию данных"
  ],
  [
    396,
    454,
    12,
    1,
    "09:30",
    "11:00",
    "active",
    "Круглый стол: этика применения генеративных моделей в образовании"
  ],
  [
    397,
    455,
    6,
    0,
    "11:00",
    "12:30",
    "active",
    "Практическое занятие по профессиональному английскому для инженеров"
  ],
  [
    398,
    456,
    26,
    1,
    "13:00",
    "14:30",
    "active",
    "Собрание проектной группы: архитектура микросервисов на Go"
  ],
  [
    399,
    457,
    20,
    0,
    "14:30",
    "16:00",
    "active",
    "Хакатон: подготовка финального питча и технической демонстрации"
  ],
  [
    400,
    458,
    40,
    1,
    "12:00",
    "13:30",
    "active",
    "Лекция приглашённого профессора по квантовым вычислениям и кубитам"
  ],
  [
    401,
    459,
    34,
    0,
    "13:30",
    "15:00",
    "active",
    "Практическое занятие по компьютерной графике, OpenGL и шейдерам"
  ],
  [
    402,
    460,
    54,
    1,
    "15:30",
    "17:00",
    "active",
    "Встреча академического куратора со старостами и первокурсниками"
  ],
  [
    403,
    461,
    48,
    0,
    "16:00",
    "17:30",
    "active",
    "Научный семинар: нейроморфные процессоры и спайковые нейронные сети"
  ],
  [
    404,
    462,
    8,
    1,
    "11:00",
    "12:30",
    "active",
    "Собрание экологического и туристического клуба университета"
  ],
  [
    405,
    463,
    2,
    0,
    "14:00",
    "16:00",
    "active",
    "Защита лабораторных работ по параллельным и распределённым вычислениям"
  ],
  [
    406,
    464,
    22,
    1,
    "14:30",
    "16:00",
    "active",
    "Отработка пропущенных лабораторных занятий по материаловедению"
  ],
  [
    407,
    465,
    16,
    0,
    "09:00",
    "10:30",
    "active",
    "Интеллектуальная игра Что? Где? Когда? среди студенческих команд"
  ],
  [
    408,
    466,
    36,
    1,
    "13:30",
    "15:00",
    "active",
    "Скрининг резюме и серия пробных технических собеседований для выпускников"
  ],
  [
    409,
    467,
    30,
    0,
    "14:00",
    "15:30",
    "active",
    "Семинар: архитектурные паттерны масштабируемых фронтенд-приложений"
  ],
  [
    410,
    468,
    50,
    1,
    "16:00",
    "17:30",
    "active",
    "Заседание студсовета: распределение путёвок и материальной помощи"
  ],
  [
    411,
    469,
    44,
    0,
    "16:30",
    "18:00",
    "active",
    "Вводная лекция по встраиваемым системам и микроконтроллерам STM32"
  ],
  [
    412,
    470,
    4,
    1,
    "14:00",
    "16:00",
    "active",
    "Проведение университетского отборочного этапа Всероссийской олимпиады"
  ],
  [
    413,
    471,
    58,
    0,
    "11:30",
    "13:00",
    "active",
    "Лабораторный практикум по реляционным базам данных"
  ],
  [
    414,
    472,
    18,
    1,
    "09:00",
    "10:30",
    "active",
    "Лекция: Архитектура микропроцессоров и низкоуровневое программирование"
  ],
  [
    415,
    473,
    12,
    0,
    "10:30",
    "12:00",
    "active",
    "Семинар по математическому анализу: кратные интегралы и ряды"
  ],
  [
    416,
    474,
    32,
    1,
    "14:00",
    "15:30",
    "active",
    "Практикум по алгоритмам и структурам данных на современном C++"
  ],
  [
    417,
    475,
    26,
    0,
    "15:00",
    "16:30",
    "active",
    "Командный созвон хакатон-команды по веб-разработке"
  ],
  [
    418,
    476,
    46,
    1,
    "16:30",
    "18:00",
    "active",
    "Заседание студенческого научного общества ФИСТ"
  ],
  [
    419,
    477,
    40,
    0,
    "09:30",
    "11:00",
    "active",
    "Репетиция доклада на международную научно-практическую конференцию"
  ],
  [
    420,
    478,
    60,
    1,
    "11:30",
    "13:00",
    "active",
    "Защита курсового проекта по сетям и телекоммуникациям"
  ],
  [
    421,
    479,
    54,
    0,
    "13:00",
    "14:30",
    "active",
    "Консультация перед рубежным контролем по дифференциальным уравнениям"
  ],
  [
    422,
    480,
    14,
    1,
    "10:30",
    "12:00",
    "active",
    "Воркшоп по введению в глубокое обучение и библиотеки PyTorch"
  ],
  [
    423,
    481,
    8,
    0,
    "12:00",
    "13:30",
    "active",
    "Собрание старостата факультета информационных технологий"
  ],
  [
    424,
    482,
    28,
    1,
    "15:00",
    "16:30",
    "active",
    "Занятие кружка олимпиадного программирования ACM ICPC"
  ],
  [
    425,
    483,
    22,
    0,
    "15:30",
    "17:00",
    "active",
    "Мастер-класс по проектированию пользовательских интерфейсов в Figma"
  ],
  [
    426,
    484,
    42,
    1,
    "09:30",
    "11:00",
    "active",
    "Лабораторная работа: сетевые протоколы, маршрутизация и BGP"
  ],
  [
    427,
    485,
    36,
    0,
    "11:00",
    "12:30",
    "active",
    "Встреча с техническим директором IT-компании: стажировки и карьера"
  ],
  [
    428,
    501,
    41,
    1,
    "13:00",
    "14:30",
    "active",
    "Коллоквиум по дискретной математике, комбинаторике и теории графов"
  ],
  [
    429,
    502,
    35,
    0,
    "14:30",
    "16:00",
    "active",
    "Собеседование в студенческую лабораторию искусственного интеллекта"
  ],
  [
    430,
    503,
    55,
    1,
    "12:00",
    "13:30",
    "active",
    "Семинар кафедры: предзащита кандидатских диссертаций"
  ],
  [
    431,
    504,
    49,
    0,
    "13:30",
    "15:00",
    "active",
    "Репетиция творческого коллектива к праздничному концерту студвесны"
  ],
  [
    432,
    505,
    9,
    1,
    "15:30",
    "17:00",
    "active",
    "Тестирование производительности и аудит безопасности веб-сервиса"
  ],
  [
    433,
    506,
    3,
    0,
    "16:00",
    "17:30",
    "active",
    "Заседание учебно-методической комиссии факультета"
  ],
  [
    434,
    507,
    23,
    1,
    "11:00",
    "12:30",
    "active",
    "Практикум по операционным системам: потоки, мьютексы и межпроцессное взаимодействие"
  ],
  [
    435,
    508,
    17,
    0,
    "14:00",
    "16:00",
    "active",
    "Организационное собрание волонтёрского корпуса университета"
  ],
  [
    436,
    509,
    37,
    1,
    "14:30",
    "16:00",
    "active",
    "Семинар по физике полупроводников: наноструктуры и квантовая оптика"
  ],
  [
    437,
    510,
    31,
    0,
    "09:00",
    "10:30",
    "active",
    "Презентация выпускных квалификационных работ бакалавров"
  ],
  [
    438,
    511,
    51,
    1,
    "13:30",
    "15:00",
    "active",
    "Консультация для студентов по линейной алгебре и аналитической геометрии"
  ],
  [
    439,
    512,
    45,
    0,
    "14:00",
    "15:30",
    "active",
    "Турнир университетской киберспортивной лиги по дисциплине Dota 2"
  ],
  [
    440,
    513,
    5,
    1,
    "16:00",
    "17:30",
    "active",
    "Лабораторная работа по криптографическим алгоритмам и шифрованию данных"
  ],
  [
    441,
    514,
    59,
    0,
    "16:30",
    "18:00",
    "active",
    "Круглый стол: этика применения генеративных моделей в образовании"
  ],
  [
    442,
    515,
    19,
    1,
    "14:00",
    "16:00",
    "active",
    "Практическое занятие по профессиональному английскому для инженеров"
  ],
  [
    443,
    516,
    13,
    0,
    "11:30",
    "13:00",
    "active",
    "Собрание проектной группы: архитектура микросервисов на Go"
  ],
  [
    444,
    517,
    33,
    1,
    "09:00",
    "10:30",
    "active",
    "Хакатон: подготовка финального питча и технической демонстрации"
  ],
  [
    445,
    518,
    27,
    0,
    "10:30",
    "12:00",
    "active",
    "Лекция приглашённого профессора по квантовым вычислениям и кубитам"
  ],
  [
    446,
    519,
    47,
    1,
    "14:00",
    "15:30",
    "active",
    "Практическое занятие по компьютерной графике, OpenGL и шейдерам"
  ],
  [
    447,
    520,
    41,
    0,
    "15:00",
    "16:30",
    "active",
    "Встреча академического куратора со старостами и первокурсниками"
  ],
  [
    448,
    521,
    1,
    1,
    "16:30",
    "18:00",
    "active",
    "Научный семинар: нейроморфные процессоры и спайковые нейронные сети"
  ],
  [
    449,
    522,
    55,
    0,
    "09:30",
    "11:00",
    "active",
    "Собрание экологического и туристического клуба университета"
  ],
  [
    450,
    523,
    15,
    1,
    "11:30",
    "13:00",
    "active",
    "Защита лабораторных работ по параллельным и распределённым вычислениям"
  ],
  [
    451,
    524,
    9,
    0,
    "13:00",
    "14:30",
    "active",
    "Отработка пропущенных лабораторных занятий по материаловедению"
  ],
  [
    452,
    525,
    29,
    1,
    "10:30",
    "12:00",
    "active",
    "Интеллектуальная игра Что? Где? Когда? среди студенческих команд"
  ],
  [
    453,
    526,
    23,
    0,
    "12:00",
    "13:30",
    "active",
    "Скрининг резюме и серия пробных технических собеседований для выпускников"
  ],
  [
    454,
    527,
    43,
    1,
    "15:00",
    "16:30",
    "active",
    "Семинар: архитектурные паттерны масштабируемых фронтенд-приложений"
  ],
  [
    455,
    528,
    37,
    0,
    "15:30",
    "17:00",
    "active",
    "Заседание студсовета: распределение путёвок и материальной помощи"
  ],
  [
    456,
    529,
    57,
    1,
    "09:30",
    "11:00",
    "active",
    "Вводная лекция по встраиваемым системам и микроконтроллерам STM32"
  ],
  [
    457,
    530,
    51,
    0,
    "11:00",
    "12:30",
    "active",
    "Проведение университетского отборочного этапа Всероссийской олимпиады"
  ],
  [
    458,
    531,
    11,
    1,
    "13:00",
    "14:30",
    "active",
    "Лабораторный практикум по реляционным базам данных"
  ],
  [
    459,
    532,
    5,
    0,
    "14:30",
    "16:00",
    "active",
    "Лекция: Архитектура микропроцессоров и низкоуровневое программирование"
  ],
  [
    460,
    533,
    25,
    1,
    "12:00",
    "13:30",
    "active",
    "Семинар по математическому анализу: кратные интегралы и ряды"
  ],
  [
    461,
    534,
    19,
    0,
    "13:30",
    "15:00",
    "active",
    "Практикум по алгоритмам и структурам данных на современном C++"
  ],
  [
    462,
    535,
    39,
    1,
    "15:30",
    "17:00",
    "active",
    "Командный созвон хакатон-команды по веб-разработке"
  ],
  [
    463,
    536,
    33,
    0,
    "16:00",
    "17:30",
    "active",
    "Заседание студенческого научного общества ФИСТ"
  ],
  [
    464,
    537,
    53,
    1,
    "11:00",
    "12:30",
    "active",
    "Репетиция доклада на международную научно-практическую конференцию"
  ],
  [
    465,
    538,
    47,
    0,
    "14:00",
    "16:00",
    "active",
    "Защита курсового проекта по сетям и телекоммуникациям"
  ],
  [
    466,
    539,
    7,
    1,
    "14:30",
    "16:00",
    "active",
    "Консультация перед рубежным контролем по дифференциальным уравнениям"
  ],
  [
    467,
    540,
    1,
    0,
    "09:00",
    "10:30",
    "active",
    "Воркшоп по введению в глубокое обучение и библиотеки PyTorch"
  ],
  [
    468,
    541,
    21,
    1,
    "13:30",
    "15:00",
    "active",
    "Собрание старостата факультета информационных технологий"
  ],
  [
    469,
    542,
    15,
    0,
    "14:00",
    "15:30",
    "active",
    "Занятие кружка олимпиадного программирования ACM ICPC"
  ],
  [
    470,
    543,
    35,
    1,
    "16:00",
    "17:30",
    "active",
    "Мастер-класс по проектированию пользовательских интерфейсов в Figma"
  ],
  [
    471,
    544,
    29,
    0,
    "16:30",
    "18:00",
    "active",
    "Лабораторная работа: сетевые протоколы, маршрутизация и BGP"
  ],
  [
    472,
    545,
    49,
    1,
    "14:00",
    "16:00",
    "active",
    "Встреча с техническим директором IT-компании: стажировки и карьера"
  ],
  [
    473,
    546,
    43,
    0,
    "11:30",
    "13:00",
    "active",
    "Коллоквиум по дискретной математике, комбинаторике и теории графов"
  ],
  [
    474,
    547,
    3,
    1,
    "09:00",
    "10:30",
    "active",
    "Собеседование в студенческую лабораторию искусственного интеллекта"
  ],
  [
    475,
    548,
    57,
    0,
    "10:30",
    "12:00",
    "active",
    "Семинар кафедры: предзащита кандидатских диссертаций"
  ],
  [
    476,
    549,
    17,
    1,
    "14:00",
    "15:30",
    "active",
    "Репетиция творческого коллектива к праздничному концерту студвесны"
  ],
  [
    477,
    550,
    11,
    0,
    "15:00",
    "16:30",
    "active",
    "Тестирование производительности и аудит безопасности веб-сервиса"
  ],
  [
    478,
    551,
    31,
    1,
    "16:30",
    "18:00",
    "active",
    "Заседание учебно-методической комиссии факультета"
  ],
  [
    479,
    552,
    25,
    0,
    "09:30",
    "11:00",
    "active",
    "Практикум по операционным системам: потоки, мьютексы и межпроцессное взаимодействие"
  ],
  [
    480,
    553,
    45,
    1,
    "11:30",
    "13:00",
    "active",
    "Организационное собрание волонтёрского корпуса университета"
  ],
  [
    481,
    554,
    39,
    0,
    "13:00",
    "14:30",
    "active",
    "Семинар по физике полупроводников: наноструктуры и квантовая оптика"
  ],
  [
    482,
    555,
    59,
    1,
    "10:30",
    "12:00",
    "active",
    "Презентация выпускных квалификационных работ бакалавров"
  ],
  [
    483,
    556,
    53,
    0,
    "12:00",
    "13:30",
    "active",
    "Консультация для студентов по линейной алгебре и аналитической геометрии"
  ],
  [
    484,
    557,
    13,
    1,
    "15:00",
    "16:30",
    "active",
    "Турнир университетской киберспортивной лиги по дисциплине Dota 2"
  ],
  [
    485,
    558,
    7,
    0,
    "15:30",
    "17:00",
    "active",
    "Лабораторная работа по криптографическим алгоритмам и шифрованию данных"
  ],
  [
    486,
    559,
    27,
    1,
    "09:30",
    "11:00",
    "active",
    "Круглый стол: этика применения генеративных моделей в образовании"
  ],
  [
    487,
    560,
    21,
    0,
    "11:00",
    "12:30",
    "active",
    "Практическое занятие по профессиональному английскому для инженеров"
  ],
  [
    488,
    561,
    41,
    1,
    "13:00",
    "14:30",
    "active",
    "Собрание проектной группы: архитектура микросервисов на Go"
  ],
  [
    489,
    562,
    35,
    0,
    "14:30",
    "16:00",
    "active",
    "Хакатон: подготовка финального питча и технической демонстрации"
  ],
  [
    490,
    563,
    55,
    1,
    "12:00",
    "13:30",
    "active",
    "Лекция приглашённого профессора по квантовым вычислениям и кубитам"
  ],
  [
    491,
    564,
    49,
    0,
    "13:30",
    "15:00",
    "active",
    "Практическое занятие по компьютерной графике, OpenGL и шейдерам"
  ],
  [
    492,
    565,
    9,
    1,
    "15:30",
    "17:00",
    "active",
    "Встреча академического куратора со старостами и первокурсниками"
  ],
  [
    493,
    566,
    3,
    0,
    "16:00",
    "17:30",
    "active",
    "Научный семинар: нейроморфные процессоры и спайковые нейронные сети"
  ],
  [
    494,
    567,
    23,
    1,
    "11:00",
    "12:30",
    "active",
    "Собрание экологического и туристического клуба университета"
  ],
  [
    495,
    568,
    17,
    0,
    "14:00",
    "16:00",
    "active",
    "Защита лабораторных работ по параллельным и распределённым вычислениям"
  ],
  [
    496,
    569,
    37,
    1,
    "14:30",
    "16:00",
    "active",
    "Отработка пропущенных лабораторных занятий по материаловедению"
  ],
  [
    497,
    570,
    31,
    0,
    "09:00",
    "10:30",
    "active",
    "Интеллектуальная игра Что? Где? Когда? среди студенческих команд"
  ],
  [
    498,
    571,
    51,
    1,
    "13:30",
    "15:00",
    "active",
    "Скрининг резюме и серия пробных технических собеседований для выпускников"
  ],
  [
    499,
    572,
    45,
    0,
    "14:00",
    "15:30",
    "active",
    "Семинар: архитектурные паттерны масштабируемых фронтенд-приложений"
  ],
  [
    500,
    573,
    5,
    1,
    "16:00",
    "17:30",
    "active",
    "Заседание студсовета: распределение путёвок и материальной помощи"
  ],
  [
    501,
    574,
    59,
    0,
    "16:30",
    "18:00",
    "active",
    "Вводная лекция по встраиваемым системам и микроконтроллерам STM32"
  ],
  [
    502,
    575,
    19,
    1,
    "14:00",
    "16:00",
    "active",
    "Проведение университетского отборочного этапа Всероссийской олимпиады"
  ],
  [
    503,
    576,
    13,
    0,
    "11:30",
    "13:00",
    "active",
    "Лабораторный практикум по реляционным базам данных"
  ],
  [
    504,
    577,
    33,
    1,
    "09:00",
    "10:30",
    "active",
    "Лекция: Архитектура микропроцессоров и низкоуровневое программирование"
  ],
  [
    505,
    578,
    27,
    0,
    "10:30",
    "12:00",
    "active",
    "Семинар по математическому анализу: кратные интегралы и ряды"
  ],
  [
    506,
    579,
    47,
    1,
    "14:00",
    "15:30",
    "active",
    "Практикум по алгоритмам и структурам данных на современном C++"
  ],
  [
    507,
    580,
    41,
    0,
    "15:00",
    "16:30",
    "active",
    "Командный созвон хакатон-команды по веб-разработке"
  ],
  [
    508,
    581,
    1,
    1,
    "16:30",
    "18:00",
    "active",
    "Заседание студенческого научного общества ФИСТ"
  ],
  [
    509,
    582,
    55,
    0,
    "09:30",
    "11:00",
    "active",
    "Репетиция доклада на международную научно-практическую конференцию"
  ],
  [
    510,
    583,
    15,
    1,
    "11:30",
    "13:00",
    "active",
    "Защита курсового проекта по сетям и телекоммуникациям"
  ],
  [
    511,
    584,
    9,
    0,
    "13:00",
    "14:30",
    "active",
    "Консультация перед рубежным контролем по дифференциальным уравнениям"
  ],
  [
    512,
    585,
    29,
    1,
    "10:30",
    "12:00",
    "active",
    "Воркшоп по введению в глубокое обучение и библиотеки PyTorch"
  ],
  [
    513,
    601,
    8,
    0,
    "12:00",
    "13:30",
    "active",
    "Собрание старостата факультета информационных технологий"
  ],
  [
    514,
    602,
    28,
    1,
    "15:00",
    "16:30",
    "active",
    "Занятие кружка олимпиадного программирования ACM ICPC"
  ],
  [
    515,
    603,
    22,
    0,
    "15:30",
    "17:00",
    "active",
    "Мастер-класс по проектированию пользовательских интерфейсов в Figma"
  ],
  [
    516,
    604,
    42,
    1,
    "09:30",
    "11:00",
    "active",
    "Лабораторная работа: сетевые протоколы, маршрутизация и BGP"
  ],
  [
    517,
    605,
    36,
    0,
    "11:00",
    "12:30",
    "active",
    "Встреча с техническим директором IT-компании: стажировки и карьера"
  ],
  [
    518,
    606,
    56,
    1,
    "13:00",
    "14:30",
    "active",
    "Коллоквиум по дискретной математике, комбинаторике и теории графов"
  ],
  [
    519,
    607,
    50,
    0,
    "14:30",
    "16:00",
    "active",
    "Собеседование в студенческую лабораторию искусственного интеллекта"
  ],
  [
    520,
    608,
    10,
    1,
    "12:00",
    "13:30",
    "active",
    "Семинар кафедры: предзащита кандидатских диссертаций"
  ],
  [
    521,
    609,
    4,
    0,
    "13:30",
    "15:00",
    "active",
    "Репетиция творческого коллектива к праздничному концерту студвесны"
  ],
  [
    522,
    610,
    24,
    1,
    "15:30",
    "17:00",
    "active",
    "Тестирование производительности и аудит безопасности веб-сервиса"
  ],
  [
    523,
    611,
    18,
    0,
    "16:00",
    "17:30",
    "active",
    "Заседание учебно-методической комиссии факультета"
  ],
  [
    524,
    612,
    38,
    1,
    "11:00",
    "12:30",
    "active",
    "Практикум по операционным системам: потоки, мьютексы и межпроцессное взаимодействие"
  ],
  [
    525,
    613,
    32,
    0,
    "14:00",
    "16:00",
    "active",
    "Организационное собрание волонтёрского корпуса университета"
  ],
  [
    526,
    614,
    52,
    1,
    "14:30",
    "16:00",
    "active",
    "Семинар по физике полупроводников: наноструктуры и квантовая оптика"
  ],
  [
    527,
    615,
    46,
    0,
    "09:00",
    "10:30",
    "active",
    "Презентация выпускных квалификационных работ бакалавров"
  ],
  [
    528,
    616,
    6,
    1,
    "13:30",
    "15:00",
    "active",
    "Консультация для студентов по линейной алгебре и аналитической геометрии"
  ],
  [
    529,
    617,
    60,
    0,
    "14:00",
    "15:30",
    "active",
    "Турнир университетской киберспортивной лиги по дисциплине Dota 2"
  ],
  [
    530,
    618,
    20,
    1,
    "16:00",
    "17:30",
    "active",
    "Лабораторная работа по криптографическим алгоритмам и шифрованию данных"
  ],
  [
    531,
    619,
    14,
    0,
    "16:30",
    "18:00",
    "active",
    "Круглый стол: этика применения генеративных моделей в образовании"
  ],
  [
    532,
    620,
    34,
    1,
    "14:00",
    "16:00",
    "active",
    "Практическое занятие по профессиональному английскому для инженеров"
  ],
  [
    533,
    621,
    28,
    0,
    "11:30",
    "13:00",
    "active",
    "Собрание проектной группы: архитектура микросервисов на Go"
  ],
  [
    534,
    622,
    48,
    1,
    "09:00",
    "10:30",
    "active",
    "Хакатон: подготовка финального питча и технической демонстрации"
  ],
  [
    535,
    623,
    42,
    0,
    "10:30",
    "12:00",
    "active",
    "Лекция приглашённого профессора по квантовым вычислениям и кубитам"
  ],
  [
    536,
    624,
    2,
    1,
    "14:00",
    "15:30",
    "active",
    "Практическое занятие по компьютерной графике, OpenGL и шейдерам"
  ],
  [
    537,
    625,
    56,
    0,
    "15:00",
    "16:30",
    "active",
    "Встреча академического куратора со старостами и первокурсниками"
  ],
  [
    538,
    626,
    16,
    1,
    "16:30",
    "18:00",
    "active",
    "Научный семинар: нейроморфные процессоры и спайковые нейронные сети"
  ],
  [
    539,
    627,
    10,
    0,
    "09:30",
    "11:00",
    "active",
    "Собрание экологического и туристического клуба университета"
  ],
  [
    540,
    628,
    30,
    1,
    "11:30",
    "13:00",
    "active",
    "Защита лабораторных работ по параллельным и распределённым вычислениям"
  ],
  [
    541,
    629,
    24,
    0,
    "13:00",
    "14:30",
    "active",
    "Отработка пропущенных лабораторных занятий по материаловедению"
  ],
  [
    542,
    630,
    44,
    1,
    "10:30",
    "12:00",
    "active",
    "Интеллектуальная игра Что? Где? Когда? среди студенческих команд"
  ],
  [
    543,
    631,
    38,
    0,
    "12:00",
    "13:30",
    "active",
    "Скрининг резюме и серия пробных технических собеседований для выпускников"
  ],
  [
    544,
    632,
    58,
    1,
    "15:00",
    "16:30",
    "active",
    "Семинар: архитектурные паттерны масштабируемых фронтенд-приложений"
  ],
  [
    545,
    633,
    52,
    0,
    "15:30",
    "17:00",
    "active",
    "Заседание студсовета: распределение путёвок и материальной помощи"
  ],
  [
    546,
    634,
    12,
    1,
    "09:30",
    "11:00",
    "active",
    "Вводная лекция по встраиваемым системам и микроконтроллерам STM32"
  ],
  [
    547,
    635,
    6,
    0,
    "11:00",
    "12:30",
    "active",
    "Проведение университетского отборочного этапа Всероссийской олимпиады"
  ],
  [
    548,
    636,
    26,
    1,
    "13:00",
    "14:30",
    "active",
    "Лабораторный практикум по реляционным базам данных"
  ],
  [
    549,
    637,
    20,
    0,
    "14:30",
    "16:00",
    "active",
    "Лекция: Архитектура микропроцессоров и низкоуровневое программирование"
  ],
  [
    550,
    638,
    40,
    1,
    "12:00",
    "13:30",
    "active",
    "Семинар по математическому анализу: кратные интегралы и ряды"
  ],
  [
    551,
    639,
    34,
    0,
    "13:30",
    "15:00",
    "active",
    "Практикум по алгоритмам и структурам данных на современном C++"
  ],
  [
    552,
    640,
    54,
    1,
    "15:30",
    "17:00",
    "active",
    "Командный созвон хакатон-команды по веб-разработке"
  ],
  [
    553,
    641,
    48,
    0,
    "16:00",
    "17:30",
    "active",
    "Заседание студенческого научного общества ФИСТ"
  ],
  [
    554,
    642,
    8,
    1,
    "11:00",
    "12:30",
    "active",
    "Репетиция доклада на международную научно-практическую конференцию"
  ],
  [
    555,
    643,
    2,
    0,
    "14:00",
    "16:00",
    "active",
    "Защита курсового проекта по сетям и телекоммуникациям"
  ],
  [
    556,
    644,
    22,
    1,
    "14:30",
    "16:00",
    "active",
    "Консультация перед рубежным контролем по дифференциальным уравнениям"
  ],
  [
    557,
    645,
    16,
    0,
    "09:00",
    "10:30",
    "active",
    "Воркшоп по введению в глубокое обучение и библиотеки PyTorch"
  ],
  [
    558,
    646,
    36,
    1,
    "13:30",
    "15:00",
    "active",
    "Собрание старостата факультета информационных технологий"
  ],
  [
    559,
    647,
    30,
    0,
    "14:00",
    "15:30",
    "active",
    "Занятие кружка олимпиадного программирования ACM ICPC"
  ],
  [
    560,
    648,
    50,
    1,
    "16:00",
    "17:30",
    "active",
    "Мастер-класс по проектированию пользовательских интерфейсов в Figma"
  ],
  [
    561,
    649,
    44,
    0,
    "16:30",
    "18:00",
    "active",
    "Лабораторная работа: сетевые протоколы, маршрутизация и BGP"
  ],
  [
    562,
    650,
    4,
    1,
    "14:00",
    "16:00",
    "active",
    "Встреча с техническим директором IT-компании: стажировки и карьера"
  ],
  [
    563,
    651,
    58,
    0,
    "11:30",
    "13:00",
    "active",
    "Коллоквиум по дискретной математике, комбинаторике и теории графов"
  ],
  [
    564,
    652,
    18,
    1,
    "09:00",
    "10:30",
    "active",
    "Собеседование в студенческую лабораторию искусственного интеллекта"
  ],
  [
    565,
    653,
    12,
    0,
    "10:30",
    "12:00",
    "active",
    "Семинар кафедры: предзащита кандидатских диссертаций"
  ],
  [
    566,
    654,
    32,
    1,
    "14:00",
    "15:30",
    "active",
    "Репетиция творческого коллектива к праздничному концерту студвесны"
  ],
  [
    567,
    655,
    26,
    0,
    "15:00",
    "16:30",
    "active",
    "Тестирование производительности и аудит безопасности веб-сервиса"
  ],
  [
    568,
    656,
    46,
    1,
    "16:30",
    "18:00",
    "active",
    "Заседание учебно-методической комиссии факультета"
  ],
  [
    569,
    657,
    40,
    0,
    "09:30",
    "11:00",
    "active",
    "Практикум по операционным системам: потоки, мьютексы и межпроцессное взаимодействие"
  ],
  [
    570,
    658,
    60,
    1,
    "11:30",
    "13:00",
    "active",
    "Организационное собрание волонтёрского корпуса университета"
  ],
  [
    571,
    659,
    54,
    0,
    "13:00",
    "14:30",
    "active",
    "Семинар по физике полупроводников: наноструктуры и квантовая оптика"
  ],
  [
    572,
    660,
    14,
    1,
    "10:30",
    "12:00",
    "active",
    "Презентация выпускных квалификационных работ бакалавров"
  ],
  [
    573,
    661,
    8,
    0,
    "12:00",
    "13:30",
    "active",
    "Консультация для студентов по линейной алгебре и аналитической геометрии"
  ],
  [
    574,
    662,
    28,
    1,
    "15:00",
    "16:30",
    "active",
    "Турнир университетской киберспортивной лиги по дисциплине Dota 2"
  ],
  [
    575,
    663,
    22,
    0,
    "15:30",
    "17:00",
    "active",
    "Лабораторная работа по криптографическим алгоритмам и шифрованию данных"
  ],
  [
    576,
    664,
    42,
    1,
    "09:30",
    "11:00",
    "active",
    "Круглый стол: этика применения генеративных моделей в образовании"
  ],
  [
    577,
    665,
    36,
    0,
    "11:00",
    "12:30",
    "active",
    "Практическое занятие по профессиональному английскому для инженеров"
  ],
  [
    578,
    666,
    56,
    1,
    "13:00",
    "14:30",
    "active",
    "Собрание проектной группы: архитектура микросервисов на Go"
  ],
  [
    579,
    667,
    50,
    0,
    "14:30",
    "16:00",
    "active",
    "Хакатон: подготовка финального питча и технической демонстрации"
  ],
  [
    580,
    668,
    10,
    1,
    "12:00",
    "13:30",
    "active",
    "Лекция приглашённого профессора по квантовым вычислениям и кубитам"
  ],
  [
    581,
    669,
    4,
    0,
    "13:30",
    "15:00",
    "active",
    "Практическое занятие по компьютерной графике, OpenGL и шейдерам"
  ],
  [
    582,
    670,
    24,
    1,
    "15:30",
    "17:00",
    "active",
    "Встреча академического куратора со старостами и первокурсниками"
  ],
  [
    583,
    671,
    18,
    0,
    "16:00",
    "17:30",
    "active",
    "Научный семинар: нейроморфные процессоры и спайковые нейронные сети"
  ],
  [
    584,
    672,
    38,
    1,
    "11:00",
    "12:30",
    "active",
    "Собрание экологического и туристического клуба университета"
  ],
  [
    585,
    673,
    32,
    0,
    "14:00",
    "16:00",
    "active",
    "Защита лабораторных работ по параллельным и распределённым вычислениям"
  ],
  [
    586,
    674,
    52,
    1,
    "14:30",
    "16:00",
    "active",
    "Отработка пропущенных лабораторных занятий по материаловедению"
  ],
  [
    587,
    675,
    46,
    0,
    "09:00",
    "10:30",
    "active",
    "Интеллектуальная игра Что? Где? Когда? среди студенческих команд"
  ],
  [
    588,
    676,
    6,
    1,
    "13:30",
    "15:00",
    "active",
    "Скрининг резюме и серия пробных технических собеседований для выпускников"
  ],
  [
    589,
    677,
    60,
    0,
    "14:00",
    "15:30",
    "active",
    "Семинар: архитектурные паттерны масштабируемых фронтенд-приложений"
  ],
  [
    590,
    678,
    20,
    1,
    "16:00",
    "17:30",
    "active",
    "Заседание студсовета: распределение путёвок и материальной помощи"
  ],
  [
    591,
    679,
    14,
    0,
    "16:30",
    "18:00",
    "active",
    "Вводная лекция по встраиваемым системам и микроконтроллерам STM32"
  ],
  [
    592,
    680,
    34,
    1,
    "14:00",
    "16:00",
    "active",
    "Проведение университетского отборочного этапа Всероссийской олимпиады"
  ],
  [
    593,
    681,
    28,
    0,
    "11:30",
    "13:00",
    "active",
    "Лабораторный практикум по реляционным базам данных"
  ],
  [
    594,
    682,
    48,
    1,
    "09:00",
    "10:30",
    "active",
    "Лекция: Архитектура микропроцессоров и низкоуровневое программирование"
  ],
  [
    595,
    683,
    42,
    0,
    "10:30",
    "12:00",
    "active",
    "Семинар по математическому анализу: кратные интегралы и ряды"
  ],
  [
    596,
    684,
    2,
    1,
    "14:00",
    "15:30",
    "active",
    "Практикум по алгоритмам и структурам данных на современном C++"
  ],
  [
    597,
    685,
    56,
    0,
    "15:00",
    "16:30",
    "active",
    "Командный созвон хакатон-команды по веб-разработке"
  ],
  [
    598,
    701,
    1,
    1,
    "16:30",
    "18:00",
    "active",
    "Заседание студенческого научного общества ФИСТ"
  ],
  [
    599,
    702,
    55,
    0,
    "09:30",
    "11:00",
    "active",
    "Репетиция доклада на международную научно-практическую конференцию"
  ],
  [
    600,
    703,
    15,
    1,
    "11:30",
    "13:00",
    "active",
    "Защита курсового проекта по сетям и телекоммуникациям"
  ],
  [
    601,
    704,
    9,
    0,
    "13:00",
    "14:30",
    "active",
    "Консультация перед рубежным контролем по дифференциальным уравнениям"
  ],
  [
    602,
    705,
    29,
    1,
    "10:30",
    "12:00",
    "active",
    "Воркшоп по введению в глубокое обучение и библиотеки PyTorch"
  ],
  [
    603,
    706,
    23,
    0,
    "12:00",
    "13:30",
    "active",
    "Собрание старостата факультета информационных технологий"
  ],
  [
    604,
    707,
    43,
    1,
    "15:00",
    "16:30",
    "active",
    "Занятие кружка олимпиадного программирования ACM ICPC"
  ],
  [
    605,
    708,
    37,
    0,
    "15:30",
    "17:00",
    "active",
    "Мастер-класс по проектированию пользовательских интерфейсов в Figma"
  ],
  [
    606,
    709,
    57,
    1,
    "09:30",
    "11:00",
    "active",
    "Лабораторная работа: сетевые протоколы, маршрутизация и BGP"
  ],
  [
    607,
    710,
    51,
    0,
    "11:00",
    "12:30",
    "active",
    "Встреча с техническим директором IT-компании: стажировки и карьера"
  ],
  [
    608,
    711,
    11,
    1,
    "13:00",
    "14:30",
    "active",
    "Коллоквиум по дискретной математике, комбинаторике и теории графов"
  ],
  [
    609,
    712,
    5,
    0,
    "14:30",
    "16:00",
    "active",
    "Собеседование в студенческую лабораторию искусственного интеллекта"
  ],
  [
    610,
    713,
    25,
    1,
    "12:00",
    "13:30",
    "active",
    "Семинар кафедры: предзащита кандидатских диссертаций"
  ],
  [
    611,
    714,
    19,
    0,
    "13:30",
    "15:00",
    "active",
    "Репетиция творческого коллектива к праздничному концерту студвесны"
  ],
  [
    612,
    715,
    39,
    1,
    "15:30",
    "17:00",
    "active",
    "Тестирование производительности и аудит безопасности веб-сервиса"
  ],
  [
    613,
    716,
    33,
    0,
    "16:00",
    "17:30",
    "active",
    "Заседание учебно-методической комиссии факультета"
  ],
  [
    614,
    717,
    53,
    1,
    "11:00",
    "12:30",
    "active",
    "Практикум по операционным системам: потоки, мьютексы и межпроцессное взаимодействие"
  ],
  [
    615,
    718,
    47,
    0,
    "14:00",
    "16:00",
    "active",
    "Организационное собрание волонтёрского корпуса университета"
  ],
  [
    616,
    719,
    7,
    1,
    "14:30",
    "16:00",
    "active",
    "Семинар по физике полупроводников: наноструктуры и квантовая оптика"
  ],
  [
    617,
    720,
    1,
    0,
    "09:00",
    "10:30",
    "active",
    "Презентация выпускных квалификационных работ бакалавров"
  ],
  [
    618,
    721,
    21,
    1,
    "13:30",
    "15:00",
    "active",
    "Консультация для студентов по линейной алгебре и аналитической геометрии"
  ],
  [
    619,
    722,
    15,
    0,
    "14:00",
    "15:30",
    "active",
    "Турнир университетской киберспортивной лиги по дисциплине Dota 2"
  ],
  [
    620,
    723,
    35,
    1,
    "16:00",
    "17:30",
    "active",
    "Лабораторная работа по криптографическим алгоритмам и шифрованию данных"
  ],
  [
    621,
    724,
    29,
    0,
    "16:30",
    "18:00",
    "active",
    "Круглый стол: этика применения генеративных моделей в образовании"
  ],
  [
    622,
    725,
    49,
    1,
    "14:00",
    "16:00",
    "active",
    "Практическое занятие по профессиональному английскому для инженеров"
  ],
  [
    623,
    726,
    43,
    0,
    "11:30",
    "13:00",
    "active",
    "Собрание проектной группы: архитектура микросервисов на Go"
  ],
  [
    624,
    727,
    3,
    1,
    "09:00",
    "10:30",
    "active",
    "Хакатон: подготовка финального питча и технической демонстрации"
  ],
  [
    625,
    728,
    57,
    0,
    "10:30",
    "12:00",
    "active",
    "Лекция приглашённого профессора по квантовым вычислениям и кубитам"
  ],
  [
    626,
    729,
    17,
    1,
    "14:00",
    "15:30",
    "active",
    "Практическое занятие по компьютерной графике, OpenGL и шейдерам"
  ],
  [
    627,
    730,
    11,
    0,
    "15:00",
    "16:30",
    "active",
    "Встреча академического куратора со старостами и первокурсниками"
  ],
  [
    628,
    731,
    31,
    1,
    "16:30",
    "18:00",
    "active",
    "Научный семинар: нейроморфные процессоры и спайковые нейронные сети"
  ],
  [
    629,
    732,
    25,
    0,
    "09:30",
    "11:00",
    "active",
    "Собрание экологического и туристического клуба университета"
  ],
  [
    630,
    733,
    45,
    1,
    "11:30",
    "13:00",
    "active",
    "Защита лабораторных работ по параллельным и распределённым вычислениям"
  ],
  [
    631,
    734,
    39,
    0,
    "13:00",
    "14:30",
    "active",
    "Отработка пропущенных лабораторных занятий по материаловедению"
  ],
  [
    632,
    735,
    59,
    1,
    "10:30",
    "12:00",
    "active",
    "Интеллектуальная игра Что? Где? Когда? среди студенческих команд"
  ],
  [
    633,
    736,
    53,
    0,
    "12:00",
    "13:30",
    "active",
    "Скрининг резюме и серия пробных технических собеседований для выпускников"
  ],
  [
    634,
    737,
    13,
    1,
    "15:00",
    "16:30",
    "active",
    "Семинар: архитектурные паттерны масштабируемых фронтенд-приложений"
  ],
  [
    635,
    738,
    7,
    0,
    "15:30",
    "17:00",
    "active",
    "Заседание студсовета: распределение путёвок и материальной помощи"
  ],
  [
    636,
    739,
    27,
    1,
    "09:30",
    "11:00",
    "active",
    "Вводная лекция по встраиваемым системам и микроконтроллерам STM32"
  ],
  [
    637,
    740,
    21,
    0,
    "11:00",
    "12:30",
    "active",
    "Проведение университетского отборочного этапа Всероссийской олимпиады"
  ],
  [
    638,
    741,
    41,
    1,
    "13:00",
    "14:30",
    "active",
    "Лабораторный практикум по реляционным базам данных"
  ],
  [
    639,
    742,
    35,
    0,
    "14:30",
    "16:00",
    "active",
    "Лекция: Архитектура микропроцессоров и низкоуровневое программирование"
  ],
  [
    640,
    743,
    55,
    1,
    "12:00",
    "13:30",
    "active",
    "Семинар по математическому анализу: кратные интегралы и ряды"
  ],
  [
    641,
    744,
    49,
    0,
    "13:30",
    "15:00",
    "active",
    "Практикум по алгоритмам и структурам данных на современном C++"
  ],
  [
    642,
    745,
    9,
    1,
    "15:30",
    "17:00",
    "active",
    "Командный созвон хакатон-команды по веб-разработке"
  ],
  [
    643,
    746,
    3,
    0,
    "16:00",
    "17:30",
    "active",
    "Заседание студенческого научного общества ФИСТ"
  ],
  [
    644,
    747,
    23,
    1,
    "11:00",
    "12:30",
    "active",
    "Репетиция доклада на международную научно-практическую конференцию"
  ],
  [
    645,
    748,
    17,
    0,
    "14:00",
    "16:00",
    "active",
    "Защита курсового проекта по сетям и телекоммуникациям"
  ],
  [
    646,
    749,
    37,
    1,
    "14:30",
    "16:00",
    "active",
    "Консультация перед рубежным контролем по дифференциальным уравнениям"
  ],
  [
    647,
    750,
    31,
    0,
    "09:00",
    "10:30",
    "active",
    "Воркшоп по введению в глубокое обучение и библиотеки PyTorch"
  ],
  [
    648,
    751,
    51,
    1,
    "13:30",
    "15:00",
    "active",
    "Собрание старостата факультета информационных технологий"
  ],
  [
    649,
    752,
    45,
    0,
    "14:00",
    "15:30",
    "active",
    "Занятие кружка олимпиадного программирования ACM ICPC"
  ],
  [
    650,
    753,
    5,
    1,
    "16:00",
    "17:30",
    "active",
    "Мастер-класс по проектированию пользовательских интерфейсов в Figma"
  ],
  [
    651,
    754,
    59,
    0,
    "16:30",
    "18:00",
    "active",
    "Лабораторная работа: сетевые протоколы, маршрутизация и BGP"
  ],
  [
    652,
    755,
    19,
    1,
    "14:00",
    "16:00",
    "active",
    "Встреча с техническим директором IT-компании: стажировки и карьера"
  ],
  [
    653,
    756,
    13,
    0,
    "11:30",
    "13:00",
    "active",
    "Коллоквиум по дискретной математике, комбинаторике и теории графов"
  ],
  [
    654,
    757,
    33,
    1,
    "09:00",
    "10:30",
    "active",
    "Собеседование в студенческую лабораторию искусственного интеллекта"
  ],
  [
    655,
    758,
    27,
    0,
    "10:30",
    "12:00",
    "active",
    "Семинар кафедры: предзащита кандидатских диссертаций"
  ],
  [
    656,
    759,
    47,
    1,
    "14:00",
    "15:30",
    "active",
    "Репетиция творческого коллектива к праздничному концерту студвесны"
  ],
  [
    657,
    760,
    41,
    0,
    "15:00",
    "16:30",
    "active",
    "Тестирование производительности и аудит безопасности веб-сервиса"
  ],
  [
    658,
    761,
    1,
    1,
    "16:30",
    "18:00",
    "active",
    "Заседание учебно-методической комиссии факультета"
  ],
  [
    659,
    762,
    55,
    0,
    "09:30",
    "11:00",
    "active",
    "Практикум по операционным системам: потоки, мьютексы и межпроцессное взаимодействие"
  ],
  [
    660,
    763,
    15,
    1,
    "11:30",
    "13:00",
    "active",
    "Организационное собрание волонтёрского корпуса университета"
  ],
  [
    661,
    764,
    9,
    0,
    "13:00",
    "14:30",
    "active",
    "Семинар по физике полупроводников: наноструктуры и квантовая оптика"
  ],
  [
    662,
    765,
    29,
    1,
    "10:30",
    "12:00",
    "active",
    "Презентация выпускных квалификационных работ бакалавров"
  ],
  [
    663,
    766,
    23,
    0,
    "12:00",
    "13:30",
    "active",
    "Консультация для студентов по линейной алгебре и аналитической геометрии"
  ],
  [
    664,
    767,
    43,
    1,
    "15:00",
    "16:30",
    "active",
    "Турнир университетской киберспортивной лиги по дисциплине Dota 2"
  ],
  [
    665,
    768,
    37,
    0,
    "15:30",
    "17:00",
    "active",
    "Лабораторная работа по криптографическим алгоритмам и шифрованию данных"
  ],
  [
    666,
    769,
    57,
    1,
    "09:30",
    "11:00",
    "active",
    "Круглый стол: этика применения генеративных моделей в образовании"
  ],
  [
    667,
    770,
    51,
    0,
    "11:00",
    "12:30",
    "active",
    "Практическое занятие по профессиональному английскому для инженеров"
  ],
  [
    668,
    771,
    11,
    1,
    "13:00",
    "14:30",
    "active",
    "Собрание проектной группы: архитектура микросервисов на Go"
  ],
  [
    669,
    772,
    5,
    0,
    "14:30",
    "16:00",
    "active",
    "Хакатон: подготовка финального питча и технической демонстрации"
  ],
  [
    670,
    773,
    25,
    1,
    "12:00",
    "13:30",
    "active",
    "Лекция приглашённого профессора по квантовым вычислениям и кубитам"
  ],
  [
    671,
    774,
    19,
    0,
    "13:30",
    "15:00",
    "active",
    "Практическое занятие по компьютерной графике, OpenGL и шейдерам"
  ],
  [
    672,
    775,
    39,
    1,
    "15:30",
    "17:00",
    "active",
    "Встреча академического куратора со старостами и первокурсниками"
  ],
  [
    673,
    776,
    33,
    0,
    "16:00",
    "17:30",
    "active",
    "Научный семинар: нейроморфные процессоры и спайковые нейронные сети"
  ],
  [
    674,
    777,
    53,
    1,
    "11:00",
    "12:30",
    "active",
    "Собрание экологического и туристического клуба университета"
  ],
  [
    675,
    778,
    47,
    0,
    "14:00",
    "16:00",
    "active",
    "Защита лабораторных работ по параллельным и распределённым вычислениям"
  ],
  [
    676,
    779,
    7,
    1,
    "14:30",
    "16:00",
    "active",
    "Отработка пропущенных лабораторных занятий по материаловедению"
  ],
  [
    677,
    780,
    1,
    0,
    "09:00",
    "10:30",
    "active",
    "Интеллектуальная игра Что? Где? Когда? среди студенческих команд"
  ],
  [
    678,
    781,
    21,
    1,
    "13:30",
    "15:00",
    "active",
    "Скрининг резюме и серия пробных технических собеседований для выпускников"
  ],
  [
    679,
    782,
    15,
    0,
    "14:00",
    "15:30",
    "active",
    "Семинар: архитектурные паттерны масштабируемых фронтенд-приложений"
  ],
  [
    680,
    783,
    35,
    1,
    "16:00",
    "17:30",
    "active",
    "Заседание студсовета: распределение путёвок и материальной помощи"
  ],
  [
    681,
    784,
    29,
    0,
    "16:30",
    "18:00",
    "active",
    "Вводная лекция по встраиваемым системам и микроконтроллерам STM32"
  ],
  [
    682,
    785,
    49,
    1,
    "14:00",
    "16:00",
    "active",
    "Проведение университетского отборочного этапа Всероссийской олимпиады"
  ],
  [
    683,
    801,
    28,
    0,
    "11:30",
    "13:00",
    "active",
    "Лабораторный практикум по реляционным базам данных"
  ],
  [
    684,
    802,
    48,
    1,
    "09:00",
    "10:30",
    "active",
    "Лекция: Архитектура микропроцессоров и низкоуровневое программирование"
  ],
  [
    685,
    803,
    42,
    0,
    "10:30",
    "12:00",
    "active",
    "Семинар по математическому анализу: кратные интегралы и ряды"
  ],
  [
    686,
    804,
    2,
    1,
    "14:00",
    "15:30",
    "active",
    "Практикум по алгоритмам и структурам данных на современном C++"
  ],
  [
    687,
    805,
    56,
    0,
    "15:00",
    "16:30",
    "active",
    "Командный созвон хакатон-команды по веб-разработке"
  ],
  [
    688,
    806,
    16,
    1,
    "16:30",
    "18:00",
    "active",
    "Заседание студенческого научного общества ФИСТ"
  ],
  [
    689,
    807,
    10,
    0,
    "09:30",
    "11:00",
    "active",
    "Репетиция доклада на международную научно-практическую конференцию"
  ],
  [
    690,
    808,
    30,
    1,
    "11:30",
    "13:00",
    "active",
    "Защита курсового проекта по сетям и телекоммуникациям"
  ],
  [
    691,
    809,
    24,
    0,
    "13:00",
    "14:30",
    "active",
    "Консультация перед рубежным контролем по дифференциальным уравнениям"
  ],
  [
    692,
    810,
    44,
    1,
    "10:30",
    "12:00",
    "active",
    "Воркшоп по введению в глубокое обучение и библиотеки PyTorch"
  ],
  [
    693,
    811,
    38,
    0,
    "12:00",
    "13:30",
    "active",
    "Собрание старостата факультета информационных технологий"
  ],
  [
    694,
    812,
    58,
    1,
    "15:00",
    "16:30",
    "active",
    "Занятие кружка олимпиадного программирования ACM ICPC"
  ],
  [
    695,
    813,
    52,
    0,
    "15:30",
    "17:00",
    "active",
    "Мастер-класс по проектированию пользовательских интерфейсов в Figma"
  ],
  [
    696,
    814,
    12,
    1,
    "09:30",
    "11:00",
    "active",
    "Лабораторная работа: сетевые протоколы, маршрутизация и BGP"
  ],
  [
    697,
    815,
    6,
    0,
    "11:00",
    "12:30",
    "active",
    "Встреча с техническим директором IT-компании: стажировки и карьера"
  ],
  [
    698,
    816,
    26,
    1,
    "13:00",
    "14:30",
    "active",
    "Коллоквиум по дискретной математике, комбинаторике и теории графов"
  ],
  [
    699,
    817,
    20,
    0,
    "14:30",
    "16:00",
    "active",
    "Собеседование в студенческую лабораторию искусственного интеллекта"
  ],
  [
    700,
    818,
    40,
    1,
    "12:00",
    "13:30",
    "active",
    "Семинар кафедры: предзащита кандидатских диссертаций"
  ],
  [
    701,
    819,
    34,
    0,
    "13:30",
    "15:00",
    "active",
    "Репетиция творческого коллектива к праздничному концерту студвесны"
  ],
  [
    702,
    820,
    54,
    1,
    "15:30",
    "17:00",
    "active",
    "Тестирование производительности и аудит безопасности веб-сервиса"
  ],
  [
    703,
    821,
    48,
    0,
    "16:00",
    "17:30",
    "active",
    "Заседание учебно-методической комиссии факультета"
  ],
  [
    704,
    822,
    8,
    1,
    "11:00",
    "12:30",
    "active",
    "Практикум по операционным системам: потоки, мьютексы и межпроцессное взаимодействие"
  ],
  [
    705,
    823,
    2,
    0,
    "14:00",
    "16:00",
    "active",
    "Организационное собрание волонтёрского корпуса университета"
  ],
  [
    706,
    824,
    22,
    1,
    "14:30",
    "16:00",
    "active",
    "Семинар по физике полупроводников: наноструктуры и квантовая оптика"
  ],
  [
    707,
    825,
    16,
    0,
    "09:00",
    "10:30",
    "active",
    "Презентация выпускных квалификационных работ бакалавров"
  ],
  [
    708,
    826,
    36,
    1,
    "13:30",
    "15:00",
    "active",
    "Консультация для студентов по линейной алгебре и аналитической геометрии"
  ],
  [
    709,
    827,
    30,
    0,
    "14:00",
    "15:30",
    "active",
    "Турнир университетской киберспортивной лиги по дисциплине Dota 2"
  ],
  [
    710,
    828,
    50,
    1,
    "16:00",
    "17:30",
    "active",
    "Лабораторная работа по криптографическим алгоритмам и шифрованию данных"
  ],
  [
    711,
    829,
    44,
    0,
    "16:30",
    "18:00",
    "active",
    "Круглый стол: этика применения генеративных моделей в образовании"
  ],
  [
    712,
    830,
    4,
    1,
    "14:00",
    "16:00",
    "active",
    "Практическое занятие по профессиональному английскому для инженеров"
  ],
  [
    713,
    831,
    58,
    0,
    "11:30",
    "13:00",
    "active",
    "Собрание проектной группы: архитектура микросервисов на Go"
  ],
  [
    714,
    832,
    18,
    1,
    "09:00",
    "10:30",
    "active",
    "Хакатон: подготовка финального питча и технической демонстрации"
  ],
  [
    715,
    833,
    12,
    0,
    "10:30",
    "12:00",
    "active",
    "Лекция приглашённого профессора по квантовым вычислениям и кубитам"
  ],
  [
    716,
    834,
    32,
    1,
    "14:00",
    "15:30",
    "active",
    "Практическое занятие по компьютерной графике, OpenGL и шейдерам"
  ],
  [
    717,
    835,
    26,
    0,
    "15:00",
    "16:30",
    "active",
    "Встреча академического куратора со старостами и первокурсниками"
  ],
  [
    718,
    836,
    46,
    1,
    "16:30",
    "18:00",
    "active",
    "Научный семинар: нейроморфные процессоры и спайковые нейронные сети"
  ],
  [
    719,
    837,
    40,
    0,
    "09:30",
    "11:00",
    "active",
    "Собрание экологического и туристического клуба университета"
  ],
  [
    720,
    838,
    60,
    1,
    "11:30",
    "13:00",
    "active",
    "Защита лабораторных работ по параллельным и распределённым вычислениям"
  ],
  [
    721,
    839,
    54,
    0,
    "13:00",
    "14:30",
    "active",
    "Отработка пропущенных лабораторных занятий по материаловедению"
  ],
  [
    722,
    840,
    14,
    1,
    "10:30",
    "12:00",
    "active",
    "Интеллектуальная игра Что? Где? Когда? среди студенческих команд"
  ],
  [
    723,
    841,
    8,
    0,
    "12:00",
    "13:30",
    "active",
    "Скрининг резюме и серия пробных технических собеседований для выпускников"
  ],
  [
    724,
    842,
    28,
    1,
    "15:00",
    "16:30",
    "active",
    "Семинар: архитектурные паттерны масштабируемых фронтенд-приложений"
  ],
  [
    725,
    843,
    22,
    0,
    "15:30",
    "17:00",
    "active",
    "Заседание студсовета: распределение путёвок и материальной помощи"
  ],
  [
    726,
    844,
    42,
    1,
    "09:30",
    "11:00",
    "active",
    "Вводная лекция по встраиваемым системам и микроконтроллерам STM32"
  ],
  [
    727,
    845,
    36,
    0,
    "11:00",
    "12:30",
    "active",
    "Проведение университетского отборочного этапа Всероссийской олимпиады"
  ],
  [
    728,
    846,
    56,
    1,
    "13:00",
    "14:30",
    "active",
    "Лабораторный практикум по реляционным базам данных"
  ],
  [
    729,
    847,
    50,
    0,
    "14:30",
    "16:00",
    "active",
    "Лекция: Архитектура микропроцессоров и низкоуровневое программирование"
  ],
  [
    730,
    848,
    10,
    1,
    "12:00",
    "13:30",
    "active",
    "Семинар по математическому анализу: кратные интегралы и ряды"
  ],
  [
    731,
    849,
    4,
    0,
    "13:30",
    "15:00",
    "active",
    "Практикум по алгоритмам и структурам данных на современном C++"
  ],
  [
    732,
    850,
    24,
    1,
    "15:30",
    "17:00",
    "active",
    "Командный созвон хакатон-команды по веб-разработке"
  ],
  [
    733,
    851,
    18,
    0,
    "16:00",
    "17:30",
    "active",
    "Заседание студенческого научного общества ФИСТ"
  ],
  [
    734,
    852,
    38,
    1,
    "11:00",
    "12:30",
    "active",
    "Репетиция доклада на международную научно-практическую конференцию"
  ],
  [
    735,
    853,
    32,
    0,
    "14:00",
    "16:00",
    "active",
    "Защита курсового проекта по сетям и телекоммуникациям"
  ],
  [
    736,
    854,
    52,
    1,
    "14:30",
    "16:00",
    "active",
    "Консультация перед рубежным контролем по дифференциальным уравнениям"
  ],
  [
    737,
    855,
    46,
    0,
    "09:00",
    "10:30",
    "active",
    "Воркшоп по введению в глубокое обучение и библиотеки PyTorch"
  ],
  [
    738,
    856,
    6,
    1,
    "13:30",
    "15:00",
    "active",
    "Собрание старостата факультета информационных технологий"
  ],
  [
    739,
    857,
    60,
    0,
    "14:00",
    "15:30",
    "active",
    "Занятие кружка олимпиадного программирования ACM ICPC"
  ],
  [
    740,
    858,
    20,
    1,
    "16:00",
    "17:30",
    "active",
    "Мастер-класс по проектированию пользовательских интерфейсов в Figma"
  ],
  [
    741,
    859,
    14,
    0,
    "16:30",
    "18:00",
    "active",
    "Лабораторная работа: сетевые протоколы, маршрутизация и BGP"
  ],
  [
    742,
    860,
    34,
    1,
    "14:00",
    "16:00",
    "active",
    "Встреча с техническим директором IT-компании: стажировки и карьера"
  ],
  [
    743,
    861,
    28,
    0,
    "11:30",
    "13:00",
    "active",
    "Коллоквиум по дискретной математике, комбинаторике и теории графов"
  ],
  [
    744,
    862,
    48,
    1,
    "09:00",
    "10:30",
    "active",
    "Собеседование в студенческую лабораторию искусственного интеллекта"
  ],
  [
    745,
    863,
    42,
    0,
    "10:30",
    "12:00",
    "active",
    "Семинар кафедры: предзащита кандидатских диссертаций"
  ],
  [
    746,
    864,
    2,
    1,
    "14:00",
    "15:30",
    "active",
    "Репетиция творческого коллектива к праздничному концерту студвесны"
  ],
  [
    747,
    865,
    56,
    0,
    "15:00",
    "16:30",
    "active",
    "Тестирование производительности и аудит безопасности веб-сервиса"
  ],
  [
    748,
    866,
    16,
    1,
    "16:30",
    "18:00",
    "active",
    "Заседание учебно-методической комиссии факультета"
  ],
  [
    749,
    867,
    10,
    0,
    "09:30",
    "11:00",
    "active",
    "Практикум по операционным системам: потоки, мьютексы и межпроцессное взаимодействие"
  ],
  [
    750,
    868,
    30,
    1,
    "11:30",
    "13:00",
    "active",
    "Организационное собрание волонтёрского корпуса университета"
  ],
  [
    751,
    869,
    24,
    0,
    "13:00",
    "14:30",
    "active",
    "Семинар по физике полупроводников: наноструктуры и квантовая оптика"
  ],
  [
    752,
    870,
    44,
    1,
    "10:30",
    "12:00",
    "active",
    "Презентация выпускных квалификационных работ бакалавров"
  ],
  [
    753,
    871,
    38,
    0,
    "12:00",
    "13:30",
    "active",
    "Консультация для студентов по линейной алгебре и аналитической геометрии"
  ],
  [
    754,
    872,
    58,
    1,
    "15:00",
    "16:30",
    "active",
    "Турнир университетской киберспортивной лиги по дисциплине Dota 2"
  ],
  [
    755,
    873,
    52,
    0,
    "15:30",
    "17:00",
    "active",
    "Лабораторная работа по криптографическим алгоритмам и шифрованию данных"
  ],
  [
    756,
    874,
    12,
    1,
    "09:30",
    "11:00",
    "active",
    "Круглый стол: этика применения генеративных моделей в образовании"
  ],
  [
    757,
    875,
    6,
    0,
    "11:00",
    "12:30",
    "active",
    "Практическое занятие по профессиональному английскому для инженеров"
  ],
  [
    758,
    876,
    26,
    1,
    "13:00",
    "14:30",
    "active",
    "Собрание проектной группы: архитектура микросервисов на Go"
  ],
  [
    759,
    877,
    20,
    0,
    "14:30",
    "16:00",
    "active",
    "Хакатон: подготовка финального питча и технической демонстрации"
  ],
  [
    760,
    878,
    40,
    1,
    "12:00",
    "13:30",
    "active",
    "Лекция приглашённого профессора по квантовым вычислениям и кубитам"
  ],
  [
    761,
    879,
    34,
    0,
    "13:30",
    "15:00",
    "active",
    "Практическое занятие по компьютерной графике, OpenGL и шейдерам"
  ],
  [
    762,
    880,
    54,
    1,
    "15:30",
    "17:00",
    "active",
    "Встреча академического куратора со старостами и первокурсниками"
  ],
  [
    763,
    881,
    48,
    0,
    "16:00",
    "17:30",
    "active",
    "Научный семинар: нейроморфные процессоры и спайковые нейронные сети"
  ],
  [
    764,
    882,
    8,
    1,
    "11:00",
    "12:30",
    "active",
    "Собрание экологического и туристического клуба университета"
  ],
  [
    765,
    883,
    2,
    0,
    "14:00",
    "16:00",
    "active",
    "Защита лабораторных работ по параллельным и распределённым вычислениям"
  ],
  [
    766,
    884,
    22,
    1,
    "14:30",
    "16:00",
    "active",
    "Отработка пропущенных лабораторных занятий по материаловедению"
  ],
  [
    767,
    885,
    16,
    0,
    "09:00",
    "10:30",
    "active",
    "Интеллектуальная игра Что? Где? Когда? среди студенческих команд"
  ],
  [
    768,
    901,
    21,
    1,
    "13:30",
    "15:00",
    "active",
    "Скрининг резюме и серия пробных технических собеседований для выпускников"
  ],
  [
    769,
    902,
    15,
    0,
    "14:00",
    "15:30",
    "active",
    "Семинар: архитектурные паттерны масштабируемых фронтенд-приложений"
  ],
  [
    770,
    903,
    35,
    1,
    "16:00",
    "17:30",
    "active",
    "Заседание студсовета: распределение путёвок и материальной помощи"
  ],
  [
    771,
    904,
    29,
    0,
    "16:30",
    "18:00",
    "active",
    "Вводная лекция по встраиваемым системам и микроконтроллерам STM32"
  ],
  [
    772,
    905,
    49,
    1,
    "14:00",
    "16:00",
    "active",
    "Проведение университетского отборочного этапа Всероссийской олимпиады"
  ],
  [
    773,
    906,
    43,
    0,
    "11:30",
    "13:00",
    "active",
    "Лабораторный практикум по реляционным базам данных"
  ],
  [
    774,
    907,
    3,
    1,
    "09:00",
    "10:30",
    "active",
    "Лекция: Архитектура микропроцессоров и низкоуровневое программирование"
  ],
  [
    775,
    908,
    57,
    0,
    "10:30",
    "12:00",
    "active",
    "Семинар по математическому анализу: кратные интегралы и ряды"
  ],
  [
    776,
    909,
    17,
    1,
    "14:00",
    "15:30",
    "active",
    "Практикум по алгоритмам и структурам данных на современном C++"
  ],
  [
    777,
    910,
    11,
    0,
    "15:00",
    "16:30",
    "active",
    "Командный созвон хакатон-команды по веб-разработке"
  ],
  [
    778,
    911,
    31,
    1,
    "16:30",
    "18:00",
    "active",
    "Заседание студенческого научного общества ФИСТ"
  ],
  [
    779,
    912,
    25,
    0,
    "09:30",
    "11:00",
    "active",
    "Репетиция доклада на международную научно-практическую конференцию"
  ],
  [
    780,
    913,
    45,
    1,
    "11:30",
    "13:00",
    "active",
    "Защита курсового проекта по сетям и телекоммуникациям"
  ],
  [
    781,
    914,
    39,
    0,
    "13:00",
    "14:30",
    "active",
    "Консультация перед рубежным контролем по дифференциальным уравнениям"
  ],
  [
    782,
    915,
    59,
    1,
    "10:30",
    "12:00",
    "active",
    "Воркшоп по введению в глубокое обучение и библиотеки PyTorch"
  ],
  [
    783,
    916,
    53,
    0,
    "12:00",
    "13:30",
    "active",
    "Собрание старостата факультета информационных технологий"
  ],
  [
    784,
    917,
    13,
    1,
    "15:00",
    "16:30",
    "active",
    "Занятие кружка олимпиадного программирования ACM ICPC"
  ],
  [
    785,
    918,
    7,
    0,
    "15:30",
    "17:00",
    "active",
    "Мастер-класс по проектированию пользовательских интерфейсов в Figma"
  ],
  [
    786,
    919,
    27,
    1,
    "09:30",
    "11:00",
    "active",
    "Лабораторная работа: сетевые протоколы, маршрутизация и BGP"
  ],
  [
    787,
    920,
    21,
    0,
    "11:00",
    "12:30",
    "active",
    "Встреча с техническим директором IT-компании: стажировки и карьера"
  ],
  [
    788,
    921,
    41,
    1,
    "13:00",
    "14:30",
    "active",
    "Коллоквиум по дискретной математике, комбинаторике и теории графов"
  ],
  [
    789,
    922,
    35,
    0,
    "14:30",
    "16:00",
    "active",
    "Собеседование в студенческую лабораторию искусственного интеллекта"
  ],
  [
    790,
    923,
    55,
    1,
    "12:00",
    "13:30",
    "active",
    "Семинар кафедры: предзащита кандидатских диссертаций"
  ],
  [
    791,
    924,
    49,
    0,
    "13:30",
    "15:00",
    "active",
    "Репетиция творческого коллектива к праздничному концерту студвесны"
  ],
  [
    792,
    925,
    9,
    1,
    "15:30",
    "17:00",
    "active",
    "Тестирование производительности и аудит безопасности веб-сервиса"
  ],
  [
    793,
    926,
    3,
    0,
    "16:00",
    "17:30",
    "active",
    "Заседание учебно-методической комиссии факультета"
  ],
  [
    794,
    927,
    23,
    1,
    "11:00",
    "12:30",
    "active",
    "Практикум по операционным системам: потоки, мьютексы и межпроцессное взаимодействие"
  ],
  [
    795,
    928,
    17,
    0,
    "14:00",
    "16:00",
    "active",
    "Организационное собрание волонтёрского корпуса университета"
  ],
  [
    796,
    929,
    37,
    1,
    "14:30",
    "16:00",
    "active",
    "Семинар по физике полупроводников: наноструктуры и квантовая оптика"
  ],
  [
    797,
    930,
    31,
    0,
    "09:00",
    "10:30",
    "active",
    "Презентация выпускных квалификационных работ бакалавров"
  ],
  [
    798,
    931,
    51,
    1,
    "13:30",
    "15:00",
    "active",
    "Консультация для студентов по линейной алгебре и аналитической геометрии"
  ],
  [
    799,
    932,
    45,
    0,
    "14:00",
    "15:30",
    "active",
    "Турнир университетской киберспортивной лиги по дисциплине Dota 2"
  ],
  [
    800,
    933,
    5,
    1,
    "16:00",
    "17:30",
    "active",
    "Лабораторная работа по криптографическим алгоритмам и шифрованию данных"
  ],
  [
    801,
    934,
    59,
    0,
    "16:30",
    "18:00",
    "active",
    "Круглый стол: этика применения генеративных моделей в образовании"
  ],
  [
    802,
    935,
    19,
    1,
    "14:00",
    "16:00",
    "active",
    "Практическое занятие по профессиональному английскому для инженеров"
  ],
  [
    803,
    936,
    13,
    0,
    "11:30",
    "13:00",
    "active",
    "Собрание проектной группы: архитектура микросервисов на Go"
  ],
  [
    804,
    937,
    33,
    1,
    "09:00",
    "10:30",
    "active",
    "Хакатон: подготовка финального питча и технической демонстрации"
  ],
  [
    805,
    938,
    27,
    0,
    "10:30",
    "12:00",
    "active",
    "Лекция приглашённого профессора по квантовым вычислениям и кубитам"
  ],
  [
    806,
    939,
    47,
    1,
    "14:00",
    "15:30",
    "active",
    "Практическое занятие по компьютерной графике, OpenGL и шейдерам"
  ],
  [
    807,
    940,
    41,
    0,
    "15:00",
    "16:30",
    "active",
    "Встреча академического куратора со старостами и первокурсниками"
  ],
  [
    808,
    941,
    1,
    1,
    "16:30",
    "18:00",
    "active",
    "Научный семинар: нейроморфные процессоры и спайковые нейронные сети"
  ],
  [
    809,
    942,
    55,
    0,
    "09:30",
    "11:00",
    "active",
    "Собрание экологического и туристического клуба университета"
  ],
  [
    810,
    943,
    15,
    1,
    "11:30",
    "13:00",
    "active",
    "Защита лабораторных работ по параллельным и распределённым вычислениям"
  ],
  [
    811,
    944,
    9,
    0,
    "13:00",
    "14:30",
    "active",
    "Отработка пропущенных лабораторных занятий по материаловедению"
  ],
  [
    812,
    945,
    29,
    1,
    "10:30",
    "12:00",
    "active",
    "Интеллектуальная игра Что? Где? Когда? среди студенческих команд"
  ],
  [
    813,
    946,
    23,
    0,
    "12:00",
    "13:30",
    "active",
    "Скрининг резюме и серия пробных технических собеседований для выпускников"
  ],
  [
    814,
    947,
    43,
    1,
    "15:00",
    "16:30",
    "active",
    "Семинар: архитектурные паттерны масштабируемых фронтенд-приложений"
  ],
  [
    815,
    948,
    37,
    0,
    "15:30",
    "17:00",
    "active",
    "Заседание студсовета: распределение путёвок и материальной помощи"
  ],
  [
    816,
    949,
    57,
    1,
    "09:30",
    "11:00",
    "active",
    "Вводная лекция по встраиваемым системам и микроконтроллерам STM32"
  ],
  [
    817,
    950,
    51,
    0,
    "11:00",
    "12:30",
    "active",
    "Проведение университетского отборочного этапа Всероссийской олимпиады"
  ],
  [
    818,
    951,
    11,
    1,
    "13:00",
    "14:30",
    "active",
    "Лабораторный практикум по реляционным базам данных"
  ],
  [
    819,
    952,
    5,
    0,
    "14:30",
    "16:00",
    "active",
    "Лекция: Архитектура микропроцессоров и низкоуровневое программирование"
  ],
  [
    820,
    953,
    25,
    1,
    "12:00",
    "13:30",
    "active",
    "Семинар по математическому анализу: кратные интегралы и ряды"
  ],
  [
    821,
    954,
    19,
    0,
    "13:30",
    "15:00",
    "active",
    "Практикум по алгоритмам и структурам данных на современном C++"
  ],
  [
    822,
    955,
    39,
    1,
    "15:30",
    "17:00",
    "active",
    "Командный созвон хакатон-команды по веб-разработке"
  ],
  [
    823,
    956,
    33,
    0,
    "16:00",
    "17:30",
    "active",
    "Заседание студенческого научного общества ФИСТ"
  ],
  [
    824,
    957,
    53,
    1,
    "11:00",
    "12:30",
    "active",
    "Репетиция доклада на международную научно-практическую конференцию"
  ],
  [
    825,
    958,
    47,
    0,
    "14:00",
    "16:00",
    "active",
    "Защита курсового проекта по сетям и телекоммуникациям"
  ],
  [
    826,
    959,
    7,
    1,
    "14:30",
    "16:00",
    "active",
    "Консультация перед рубежным контролем по дифференциальным уравнениям"
  ],
  [
    827,
    960,
    1,
    0,
    "09:00",
    "10:30",
    "active",
    "Воркшоп по введению в глубокое обучение и библиотеки PyTorch"
  ],
  [
    828,
    961,
    21,
    1,
    "13:30",
    "15:00",
    "active",
    "Собрание старостата факультета информационных технологий"
  ],
  [
    829,
    962,
    15,
    0,
    "14:00",
    "15:30",
    "active",
    "Занятие кружка олимпиадного программирования ACM ICPC"
  ],
  [
    830,
    963,
    35,
    1,
    "16:00",
    "17:30",
    "active",
    "Мастер-класс по проектированию пользовательских интерфейсов в Figma"
  ],
  [
    831,
    964,
    29,
    0,
    "16:30",
    "18:00",
    "active",
    "Лабораторная работа: сетевые протоколы, маршрутизация и BGP"
  ],
  [
    832,
    965,
    49,
    1,
    "14:00",
    "16:00",
    "active",
    "Встреча с техническим директором IT-компании: стажировки и карьера"
  ],
  [
    833,
    966,
    43,
    0,
    "11:30",
    "13:00",
    "active",
    "Коллоквиум по дискретной математике, комбинаторике и теории графов"
  ],
  [
    834,
    967,
    3,
    1,
    "09:00",
    "10:30",
    "active",
    "Собеседование в студенческую лабораторию искусственного интеллекта"
  ],
  [
    835,
    968,
    57,
    0,
    "10:30",
    "12:00",
    "active",
    "Семинар кафедры: предзащита кандидатских диссертаций"
  ],
  [
    836,
    969,
    17,
    1,
    "14:00",
    "15:30",
    "active",
    "Репетиция творческого коллектива к праздничному концерту студвесны"
  ],
  [
    837,
    970,
    11,
    0,
    "15:00",
    "16:30",
    "active",
    "Тестирование производительности и аудит безопасности веб-сервиса"
  ],
  [
    838,
    971,
    31,
    1,
    "16:30",
    "18:00",
    "active",
    "Заседание учебно-методической комиссии факультета"
  ],
  [
    839,
    972,
    25,
    0,
    "09:30",
    "11:00",
    "active",
    "Практикум по операционным системам: потоки, мьютексы и межпроцессное взаимодействие"
  ],
  [
    840,
    973,
    45,
    1,
    "11:30",
    "13:00",
    "active",
    "Организационное собрание волонтёрского корпуса университета"
  ],
  [
    841,
    974,
    39,
    0,
    "13:00",
    "14:30",
    "active",
    "Семинар по физике полупроводников: наноструктуры и квантовая оптика"
  ],
  [
    842,
    975,
    59,
    1,
    "10:30",
    "12:00",
    "active",
    "Презентация выпускных квалификационных работ бакалавров"
  ],
  [
    843,
    976,
    53,
    0,
    "12:00",
    "13:30",
    "active",
    "Консультация для студентов по линейной алгебре и аналитической геометрии"
  ],
  [
    844,
    977,
    13,
    1,
    "15:00",
    "16:30",
    "active",
    "Турнир университетской киберспортивной лиги по дисциплине Dota 2"
  ],
  [
    845,
    978,
    7,
    0,
    "15:30",
    "17:00",
    "active",
    "Лабораторная работа по криптографическим алгоритмам и шифрованию данных"
  ],
  [
    846,
    979,
    27,
    1,
    "09:30",
    "11:00",
    "active",
    "Круглый стол: этика применения генеративных моделей в образовании"
  ],
  [
    847,
    980,
    21,
    0,
    "11:00",
    "12:30",
    "active",
    "Практическое занятие по профессиональному английскому для инженеров"
  ],
  [
    848,
    981,
    41,
    1,
    "13:00",
    "14:30",
    "active",
    "Собрание проектной группы: архитектура микросервисов на Go"
  ],
  [
    849,
    982,
    35,
    0,
    "14:30",
    "16:00",
    "active",
    "Хакатон: подготовка финального питча и технической демонстрации"
  ],
  [
    850,
    983,
    55,
    1,
    "12:00",
    "13:30",
    "active",
    "Лекция приглашённого профессора по квантовым вычислениям и кубитам"
  ],
  [
    851,
    984,
    49,
    0,
    "13:30",
    "15:00",
    "active",
    "Практическое занятие по компьютерной графике, OpenGL и шейдерам"
  ],
  [
    852,
    985,
    9,
    1,
    "15:30",
    "17:00",
    "active",
    "Встреча академического куратора со старостами и первокурсниками"
  ],
  [
    853,
    1,
    50,
    2,
    "11:30",
    "13:00",
    "active",
    "Научный семинар: нейроморфные процессоры и спайковые нейронные сети"
  ],
  [
    854,
    2,
    23,
    0,
    "10:30",
    "12:00",
    "active",
    "Собрание экологического и туристического клуба университета"
  ],
  [
    855,
    3,
    53,
    1,
    "14:00",
    "16:00",
    "active",
    "Защита лабораторных работ по параллельным и распределённым вычислениям"
  ],
  [
    856,
    5,
    15,
    1,
    "11:30",
    "13:00",
    "active",
    "Отработка пропущенных лабораторных занятий по материаловедению"
  ],
  [
    857,
    6,
    7,
    0,
    "13:30",
    "15:00",
    "active",
    "Интеллектуальная игра Что? Где? Когда? среди студенческих команд"
  ],
  [
    858,
    7,
    56,
    2,
    "09:00",
    "10:30",
    "active",
    "Скрининг резюме и серия пробных технических собеседований для выпускников"
  ],
  [
    859,
    8,
    29,
    0,
    "14:00",
    "15:30",
    "active",
    "Семинар: архитектурные паттерны масштабируемых фронтенд-приложений"
  ],
  [
    860,
    9,
    59,
    1,
    "14:30",
    "16:00",
    "active",
    "Заседание студсовета: распределение путёвок и материальной помощи"
  ],
  [
    861,
    10,
    29,
    2,
    "09:30",
    "11:00",
    "active",
    "Вводная лекция по встраиваемым системам и микроконтроллерам STM32"
  ],
  [
    862,
    11,
    21,
    1,
    "09:00",
    "10:30",
    "active",
    "Проведение университетского отборочного этапа Всероссийской олимпиады"
  ],
  [
    863,
    12,
    13,
    0,
    "15:30",
    "17:00",
    "active",
    "Лабораторный практикум по реляционным базам данных"
  ],
  [
    864,
    13,
    2,
    2,
    "13:30",
    "15:00",
    "active",
    "Лекция: Архитектура микропроцессоров и низкоуровневое программирование"
  ],
  [
    865,
    14,
    35,
    0,
    "16:00",
    "17:30",
    "active",
    "Семинар по математическому анализу: кратные интегралы и ряды"
  ],
  [
    866,
    15,
    5,
    1,
    "12:00",
    "13:30",
    "active",
    "Практикум по алгоритмам и структурам данных на современном C++"
  ],
  [
    867,
    16,
    35,
    2,
    "11:30",
    "13:00",
    "active",
    "Командный созвон хакатон-команды по веб-разработке"
  ],
  [
    868,
    17,
    27,
    1,
    "13:30",
    "15:00",
    "active",
    "Заседание студенческого научного общества ФИСТ"
  ],
  [
    869,
    18,
    19,
    0,
    "09:30",
    "11:00",
    "active",
    "Репетиция доклада на международную научно-практическую конференцию"
  ],
  [
    870,
    19,
    8,
    2,
    "15:30",
    "17:00",
    "active",
    "Защита курсового проекта по сетям и телекоммуникациям"
  ],
  [
    871,
    20,
    41,
    0,
    "11:00",
    "12:30",
    "active",
    "Консультация перед рубежным контролем по дифференциальным уравнениям"
  ],
  [
    872,
    21,
    11,
    1,
    "15:00",
    "16:30",
    "active",
    "Воркшоп по введению в глубокое обучение и библиотеки PyTorch"
  ],
  [
    873,
    22,
    41,
    2,
    "09:00",
    "10:30",
    "active",
    "Собрание старостата факультета информационных технологий"
  ],
  [
    874,
    23,
    33,
    1,
    "15:30",
    "17:00",
    "active",
    "Занятие кружка олимпиадного программирования ACM ICPC"
  ],
  [
    875,
    24,
    25,
    0,
    "11:30",
    "13:00",
    "active",
    "Мастер-класс по проектированию пользовательских интерфейсов в Figma"
  ],
  [
    876,
    25,
    14,
    2,
    "09:30",
    "11:00",
    "active",
    "Лабораторная работа: сетевые протоколы, маршрутизация и BGP"
  ],
  [
    877,
    26,
    47,
    0,
    "13:00",
    "14:30",
    "active",
    "Встреча с техническим директором IT-компании: стажировки и карьера"
  ],
  [
    878,
    27,
    17,
    1,
    "16:30",
    "18:00",
    "active",
    "Коллоквиум по дискретной математике, комбинаторике и теории графов"
  ],
  [
    879,
    28,
    47,
    2,
    "13:30",
    "15:00",
    "active",
    "Собеседование в студенческую лабораторию искусственного интеллекта"
  ],
  [
    880,
    29,
    39,
    1,
    "09:30",
    "11:00",
    "active",
    "Семинар кафедры: предзащита кандидатских диссертаций"
  ],
  [
    881,
    30,
    31,
    0,
    "09:00",
    "10:30",
    "active",
    "Репетиция творческого коллектива к праздничному концерту студвесны"
  ],
  [
    882,
    31,
    20,
    2,
    "11:30",
    "13:00",
    "active",
    "Тестирование производительности и аудит безопасности веб-сервиса"
  ],
  [
    883,
    32,
    53,
    0,
    "10:30",
    "12:00",
    "active",
    "Заседание учебно-методической комиссии факультета"
  ],
  [
    884,
    33,
    23,
    1,
    "14:00",
    "16:00",
    "active",
    "Практикум по операционным системам: потоки, мьютексы и межпроцессное взаимодействие"
  ],
  [
    885,
    34,
    53,
    2,
    "15:30",
    "17:00",
    "active",
    "Организационное собрание волонтёрского корпуса университета"
  ],
  [
    886,
    35,
    45,
    1,
    "11:30",
    "13:00",
    "active",
    "Семинар по физике полупроводников: наноструктуры и квантовая оптика"
  ],
  [
    887,
    36,
    37,
    0,
    "13:30",
    "15:00",
    "active",
    "Презентация выпускных квалификационных работ бакалавров"
  ],
  [
    888,
    37,
    26,
    2,
    "09:00",
    "10:30",
    "active",
    "Консультация для студентов по линейной алгебре и аналитической геометрии"
  ],
  [
    889,
    38,
    59,
    0,
    "14:00",
    "15:30",
    "active",
    "Турнир университетской киберспортивной лиги по дисциплине Dota 2"
  ],
  [
    890,
    39,
    29,
    1,
    "14:30",
    "16:00",
    "active",
    "Лабораторная работа по криптографическим алгоритмам и шифрованию данных"
  ],
  [
    891,
    40,
    59,
    2,
    "09:30",
    "11:00",
    "active",
    "Круглый стол: этика применения генеративных моделей в образовании"
  ],
  [
    892,
    41,
    51,
    1,
    "09:00",
    "10:30",
    "active",
    "Практическое занятие по профессиональному английскому для инженеров"
  ],
  [
    893,
    42,
    43,
    0,
    "15:30",
    "17:00",
    "active",
    "Собрание проектной группы: архитектура микросервисов на Go"
  ],
  [
    894,
    43,
    32,
    2,
    "13:30",
    "15:00",
    "active",
    "Хакатон: подготовка финального питча и технической демонстрации"
  ],
  [
    895,
    44,
    5,
    0,
    "16:00",
    "17:30",
    "active",
    "Лекция приглашённого профессора по квантовым вычислениям и кубитам"
  ],
  [
    896,
    45,
    35,
    1,
    "12:00",
    "13:30",
    "active",
    "Практическое занятие по компьютерной графике, OpenGL и шейдерам"
  ],
  [
    897,
    46,
    5,
    2,
    "11:30",
    "13:00",
    "active",
    "Встреча академического куратора со старостами и первокурсниками"
  ],
  [
    898,
    47,
    57,
    1,
    "13:30",
    "15:00",
    "active",
    "Научный семинар: нейроморфные процессоры и спайковые нейронные сети"
  ],
  [
    899,
    48,
    49,
    0,
    "09:30",
    "11:00",
    "active",
    "Собрание экологического и туристического клуба университета"
  ],
  [
    900,
    49,
    38,
    2,
    "15:30",
    "17:00",
    "active",
    "Защита лабораторных работ по параллельным и распределённым вычислениям"
  ],
  [
    901,
    50,
    11,
    0,
    "11:00",
    "12:30",
    "active",
    "Отработка пропущенных лабораторных занятий по материаловедению"
  ],
  [
    902,
    51,
    41,
    1,
    "15:00",
    "16:30",
    "active",
    "Интеллектуальная игра Что? Где? Когда? среди студенческих команд"
  ],
  [
    903,
    52,
    11,
    2,
    "09:00",
    "10:30",
    "active",
    "Скрининг резюме и серия пробных технических собеседований для выпускников"
  ],
  [
    904,
    53,
    3,
    1,
    "15:30",
    "17:00",
    "active",
    "Семинар: архитектурные паттерны масштабируемых фронтенд-приложений"
  ],
  [
    905,
    54,
    55,
    0,
    "11:30",
    "13:00",
    "active",
    "Заседание студсовета: распределение путёвок и материальной помощи"
  ],
  [
    906,
    55,
    44,
    2,
    "09:30",
    "11:00",
    "active",
    "Вводная лекция по встраиваемым системам и микроконтроллерам STM32"
  ],
  [
    907,
    56,
    17,
    0,
    "13:00",
    "14:30",
    "active",
    "Проведение университетского отборочного этапа Всероссийской олимпиады"
  ],
  [
    908,
    57,
    47,
    1,
    "16:30",
    "18:00",
    "active",
    "Лабораторный практикум по реляционным базам данных"
  ],
  [
    909,
    58,
    17,
    2,
    "13:30",
    "15:00",
    "active",
    "Лекция: Архитектура микропроцессоров и низкоуровневое программирование"
  ],
  [
    910,
    59,
    9,
    1,
    "09:30",
    "11:00",
    "active",
    "Семинар по математическому анализу: кратные интегралы и ряды"
  ],
  [
    911,
    60,
    1,
    0,
    "09:00",
    "10:30",
    "active",
    "Практикум по алгоритмам и структурам данных на современном C++"
  ],
  [
    912,
    61,
    50,
    2,
    "11:30",
    "13:00",
    "active",
    "Командный созвон хакатон-команды по веб-разработке"
  ],
  [
    913,
    62,
    23,
    0,
    "10:30",
    "12:00",
    "active",
    "Заседание студенческого научного общества ФИСТ"
  ],
  [
    914,
    63,
    53,
    1,
    "14:00",
    "16:00",
    "active",
    "Репетиция доклада на международную научно-практическую конференцию"
  ],
  [
    915,
    64,
    23,
    2,
    "15:30",
    "17:00",
    "active",
    "Защита курсового проекта по сетям и телекоммуникациям"
  ],
  [
    916,
    65,
    15,
    1,
    "11:30",
    "13:00",
    "active",
    "Консультация перед рубежным контролем по дифференциальным уравнениям"
  ],
  [
    917,
    66,
    7,
    0,
    "13:30",
    "15:00",
    "active",
    "Воркшоп по введению в глубокое обучение и библиотеки PyTorch"
  ],
  [
    918,
    67,
    56,
    2,
    "09:00",
    "10:30",
    "active",
    "Собрание старостата факультета информационных технологий"
  ],
  [
    919,
    68,
    29,
    0,
    "14:00",
    "15:30",
    "active",
    "Занятие кружка олимпиадного программирования ACM ICPC"
  ],
  [
    920,
    69,
    59,
    1,
    "14:30",
    "16:00",
    "active",
    "Мастер-класс по проектированию пользовательских интерфейсов в Figma"
  ],
  [
    921,
    70,
    29,
    2,
    "09:30",
    "11:00",
    "active",
    "Лабораторная работа: сетевые протоколы, маршрутизация и BGP"
  ],
  [
    922,
    71,
    21,
    1,
    "09:00",
    "10:30",
    "active",
    "Встреча с техническим директором IT-компании: стажировки и карьера"
  ],
  [
    923,
    72,
    13,
    0,
    "15:30",
    "17:00",
    "active",
    "Коллоквиум по дискретной математике, комбинаторике и теории графов"
  ],
  [
    924,
    73,
    2,
    2,
    "13:30",
    "15:00",
    "active",
    "Собеседование в студенческую лабораторию искусственного интеллекта"
  ],
  [
    925,
    74,
    35,
    0,
    "16:00",
    "17:30",
    "active",
    "Семинар кафедры: предзащита кандидатских диссертаций"
  ],
  [
    926,
    75,
    5,
    1,
    "12:00",
    "13:30",
    "active",
    "Репетиция творческого коллектива к праздничному концерту студвесны"
  ],
  [
    927,
    76,
    35,
    2,
    "11:30",
    "13:00",
    "active",
    "Тестирование производительности и аудит безопасности веб-сервиса"
  ],
  [
    928,
    77,
    27,
    1,
    "13:30",
    "15:00",
    "active",
    "Заседание учебно-методической комиссии факультета"
  ],
  [
    929,
    78,
    19,
    0,
    "09:30",
    "11:00",
    "active",
    "Практикум по операционным системам: потоки, мьютексы и межпроцессное взаимодействие"
  ],
  [
    930,
    79,
    8,
    2,
    "15:30",
    "17:00",
    "active",
    "Организационное собрание волонтёрского корпуса университета"
  ],
  [
    931,
    80,
    41,
    0,
    "11:00",
    "12:30",
    "active",
    "Семинар по физике полупроводников: наноструктуры и квантовая оптика"
  ],
  [
    932,
    81,
    11,
    1,
    "15:00",
    "16:30",
    "active",
    "Презентация выпускных квалификационных работ бакалавров"
  ],
  [
    933,
    82,
    41,
    2,
    "09:00",
    "10:30",
    "active",
    "Консультация для студентов по линейной алгебре и аналитической геометрии"
  ],
  [
    934,
    83,
    33,
    1,
    "15:30",
    "17:00",
    "active",
    "Турнир университетской киберспортивной лиги по дисциплине Dota 2"
  ],
  [
    935,
    84,
    25,
    0,
    "11:30",
    "13:00",
    "active",
    "Лабораторная работа по криптографическим алгоритмам и шифрованию данных"
  ],
  [
    936,
    85,
    14,
    2,
    "09:30",
    "11:00",
    "active",
    "Круглый стол: этика применения генеративных моделей в образовании"
  ],
  [
    937,
    86,
    47,
    0,
    "13:00",
    "14:30",
    "active",
    "Практическое занятие по профессиональному английскому для инженеров"
  ],
  [
    938,
    87,
    17,
    1,
    "16:30",
    "18:00",
    "active",
    "Собрание проектной группы: архитектура микросервисов на Go"
  ],
  [
    939,
    88,
    47,
    2,
    "13:30",
    "15:00",
    "active",
    "Хакатон: подготовка финального питча и технической демонстрации"
  ],
  [
    940,
    89,
    39,
    1,
    "09:30",
    "11:00",
    "active",
    "Лекция приглашённого профессора по квантовым вычислениям и кубитам"
  ],
  [
    941,
    90,
    31,
    0,
    "09:00",
    "10:30",
    "active",
    "Практическое занятие по компьютерной графике, OpenGL и шейдерам"
  ],
  [
    942,
    91,
    20,
    2,
    "11:30",
    "13:00",
    "active",
    "Встреча академического куратора со старостами и первокурсниками"
  ],
  [
    943,
    92,
    53,
    0,
    "10:30",
    "12:00",
    "active",
    "Научный семинар: нейроморфные процессоры и спайковые нейронные сети"
  ],
  [
    944,
    93,
    23,
    1,
    "14:00",
    "16:00",
    "active",
    "Собрание экологического и туристического клуба университета"
  ],
  [
    945,
    94,
    53,
    2,
    "15:30",
    "17:00",
    "active",
    "Защита лабораторных работ по параллельным и распределённым вычислениям"
  ],
  [
    946,
    110,
    30,
    1,
    "11:30",
    "13:00",
    "active",
    "Отработка пропущенных лабораторных занятий по материаловедению"
  ],
  [
    947,
    111,
    22,
    0,
    "13:30",
    "15:00",
    "active",
    "Интеллектуальная игра Что? Где? Когда? среди студенческих команд"
  ],
  [
    948,
    112,
    11,
    2,
    "09:00",
    "10:30",
    "active",
    "Скрининг резюме и серия пробных технических собеседований для выпускников"
  ],
  [
    949,
    113,
    44,
    0,
    "14:00",
    "15:30",
    "active",
    "Семинар: архитектурные паттерны масштабируемых фронтенд-приложений"
  ],
  [
    950,
    114,
    14,
    1,
    "14:30",
    "16:00",
    "active",
    "Заседание студсовета: распределение путёвок и материальной помощи"
  ],
  [
    951,
    115,
    44,
    2,
    "09:30",
    "11:00",
    "active",
    "Вводная лекция по встраиваемым системам и микроконтроллерам STM32"
  ],
  [
    952,
    116,
    36,
    1,
    "09:00",
    "10:30",
    "active",
    "Проведение университетского отборочного этапа Всероссийской олимпиады"
  ],
  [
    953,
    117,
    28,
    0,
    "15:30",
    "17:00",
    "active",
    "Лабораторный практикум по реляционным базам данных"
  ],
  [
    954,
    118,
    17,
    2,
    "13:30",
    "15:00",
    "active",
    "Лекция: Архитектура микропроцессоров и низкоуровневое программирование"
  ],
  [
    955,
    119,
    50,
    0,
    "16:00",
    "17:30",
    "active",
    "Семинар по математическому анализу: кратные интегралы и ряды"
  ],
  [
    956,
    120,
    20,
    1,
    "12:00",
    "13:30",
    "active",
    "Практикум по алгоритмам и структурам данных на современном C++"
  ],
  [
    957,
    121,
    50,
    2,
    "11:30",
    "13:00",
    "active",
    "Командный созвон хакатон-команды по веб-разработке"
  ],
  [
    958,
    122,
    42,
    1,
    "13:30",
    "15:00",
    "active",
    "Заседание студенческого научного общества ФИСТ"
  ],
  [
    959,
    123,
    34,
    0,
    "09:30",
    "11:00",
    "active",
    "Репетиция доклада на международную научно-практическую конференцию"
  ],
  [
    960,
    124,
    23,
    2,
    "15:30",
    "17:00",
    "active",
    "Защита курсового проекта по сетям и телекоммуникациям"
  ],
  [
    961,
    125,
    56,
    0,
    "11:00",
    "12:30",
    "active",
    "Консультация перед рубежным контролем по дифференциальным уравнениям"
  ],
  [
    962,
    126,
    26,
    1,
    "15:00",
    "16:30",
    "active",
    "Воркшоп по введению в глубокое обучение и библиотеки PyTorch"
  ],
  [
    963,
    127,
    56,
    2,
    "09:00",
    "10:30",
    "active",
    "Собрание старостата факультета информационных технологий"
  ],
  [
    964,
    128,
    48,
    1,
    "15:30",
    "17:00",
    "active",
    "Занятие кружка олимпиадного программирования ACM ICPC"
  ],
  [
    965,
    129,
    40,
    0,
    "11:30",
    "13:00",
    "active",
    "Мастер-класс по проектированию пользовательских интерфейсов в Figma"
  ],
  [
    966,
    130,
    29,
    2,
    "09:30",
    "11:00",
    "active",
    "Лабораторная работа: сетевые протоколы, маршрутизация и BGP"
  ],
  [
    967,
    131,
    2,
    0,
    "13:00",
    "14:30",
    "active",
    "Встреча с техническим директором IT-компании: стажировки и карьера"
  ],
  [
    968,
    132,
    32,
    1,
    "16:30",
    "18:00",
    "active",
    "Коллоквиум по дискретной математике, комбинаторике и теории графов"
  ],
  [
    969,
    133,
    2,
    2,
    "13:30",
    "15:00",
    "active",
    "Собеседование в студенческую лабораторию искусственного интеллекта"
  ],
  [
    970,
    134,
    54,
    1,
    "09:30",
    "11:00",
    "active",
    "Семинар кафедры: предзащита кандидатских диссертаций"
  ],
  [
    971,
    135,
    46,
    0,
    "09:00",
    "10:30",
    "active",
    "Репетиция творческого коллектива к праздничному концерту студвесны"
  ],
  [
    972,
    136,
    35,
    2,
    "11:30",
    "13:00",
    "active",
    "Тестирование производительности и аудит безопасности веб-сервиса"
  ],
  [
    973,
    137,
    8,
    0,
    "10:30",
    "12:00",
    "active",
    "Заседание учебно-методической комиссии факультета"
  ],
  [
    974,
    138,
    38,
    1,
    "14:00",
    "16:00",
    "active",
    "Практикум по операционным системам: потоки, мьютексы и межпроцессное взаимодействие"
  ],
  [
    975,
    139,
    8,
    2,
    "15:30",
    "17:00",
    "active",
    "Организационное собрание волонтёрского корпуса университета"
  ],
  [
    976,
    140,
    60,
    1,
    "11:30",
    "13:00",
    "active",
    "Семинар по физике полупроводников: наноструктуры и квантовая оптика"
  ],
  [
    977,
    141,
    52,
    0,
    "13:30",
    "15:00",
    "active",
    "Презентация выпускных квалификационных работ бакалавров"
  ],
  [
    978,
    142,
    41,
    2,
    "09:00",
    "10:30",
    "active",
    "Консультация для студентов по линейной алгебре и аналитической геометрии"
  ],
  [
    979,
    143,
    14,
    0,
    "14:00",
    "15:30",
    "active",
    "Турнир университетской киберспортивной лиги по дисциплине Dota 2"
  ],
  [
    980,
    144,
    44,
    1,
    "14:30",
    "16:00",
    "active",
    "Лабораторная работа по криптографическим алгоритмам и шифрованию данных"
  ],
  [
    981,
    145,
    14,
    2,
    "09:30",
    "11:00",
    "active",
    "Круглый стол: этика применения генеративных моделей в образовании"
  ],
  [
    982,
    146,
    6,
    1,
    "09:00",
    "10:30",
    "active",
    "Практическое занятие по профессиональному английскому для инженеров"
  ],
  [
    983,
    147,
    58,
    0,
    "15:30",
    "17:00",
    "active",
    "Собрание проектной группы: архитектура микросервисов на Go"
  ],
  [
    984,
    148,
    47,
    2,
    "13:30",
    "15:00",
    "active",
    "Хакатон: подготовка финального питча и технической демонстрации"
  ],
  [
    985,
    149,
    20,
    0,
    "16:00",
    "17:30",
    "active",
    "Лекция приглашённого профессора по квантовым вычислениям и кубитам"
  ],
  [
    986,
    150,
    50,
    1,
    "12:00",
    "13:30",
    "active",
    "Практическое занятие по компьютерной графике, OpenGL и шейдерам"
  ],
  [
    987,
    151,
    20,
    2,
    "11:30",
    "13:00",
    "active",
    "Встреча академического куратора со старостами и первокурсниками"
  ],
  [
    988,
    152,
    12,
    1,
    "13:30",
    "15:00",
    "active",
    "Научный семинар: нейроморфные процессоры и спайковые нейронные сети"
  ],
  [
    989,
    153,
    4,
    0,
    "09:30",
    "11:00",
    "active",
    "Собрание экологического и туристического клуба университета"
  ],
  [
    990,
    154,
    53,
    2,
    "15:30",
    "17:00",
    "active",
    "Защита лабораторных работ по параллельным и распределённым вычислениям"
  ],
  [
    991,
    155,
    26,
    0,
    "11:00",
    "12:30",
    "active",
    "Отработка пропущенных лабораторных занятий по материаловедению"
  ],
  [
    992,
    156,
    56,
    1,
    "15:00",
    "16:30",
    "active",
    "Интеллектуальная игра Что? Где? Когда? среди студенческих команд"
  ],
  [
    993,
    157,
    26,
    2,
    "09:00",
    "10:30",
    "active",
    "Скрининг резюме и серия пробных технических собеседований для выпускников"
  ],
  [
    994,
    158,
    18,
    1,
    "15:30",
    "17:00",
    "active",
    "Семинар: архитектурные паттерны масштабируемых фронтенд-приложений"
  ],
  [
    995,
    159,
    10,
    0,
    "11:30",
    "13:00",
    "active",
    "Заседание студсовета: распределение путёвок и материальной помощи"
  ],
  [
    996,
    160,
    59,
    2,
    "09:30",
    "11:00",
    "active",
    "Вводная лекция по встраиваемым системам и микроконтроллерам STM32"
  ],
  [
    997,
    161,
    32,
    0,
    "13:00",
    "14:30",
    "active",
    "Проведение университетского отборочного этапа Всероссийской олимпиады"
  ],
  [
    998,
    162,
    2,
    1,
    "16:30",
    "18:00",
    "active",
    "Лабораторный практикум по реляционным базам данных"
  ],
  [
    999,
    163,
    32,
    2,
    "13:30",
    "15:00",
    "active",
    "Лекция: Архитектура микропроцессоров и низкоуровневое программирование"
  ],
  [
    1000,
    164,
    24,
    1,
    "09:30",
    "11:00",
    "active",
    "Семинар по математическому анализу: кратные интегралы и ряды"
  ]
]

export interface MockDb {
  seededOn: string
  users: User[]
  rooms: Room[]
  bookings: Booking[]
  nextRoomId: number
  nextBookingId: number
}

/** Даты броней подставляются относительно сегодняшнего дня (RELATIVE:0/+1/+2/...). */
export const createSeedDb = (today = todayISO()): MockDb => {
  const bookings: Booking[] = SEED_BOOKINGS.map(([id, roomId, userId, offset, startTime, endTime, status, comment]) => {
    const room = SEED_ROOMS.find((r) => r.id === roomId)!
    const user = SEED_USERS.find((u) => u.id === userId)!
    return {
      id,
      roomId,
      roomName: room.name,
      userId,
      userDisplayName: user.displayName,
      date: addDaysISO(today, offset),
      startTime,
      endTime,
      status,
      comment,
    }
  })
  return {
    seededOn: today,
    users: SEED_USERS.map((u) => ({ ...u })),
    rooms: SEED_ROOMS.map((r) => ({ ...r, equipment: [...r.equipment] })),
    bookings,
    nextRoomId: SEED_ROOMS.length + 1,
    nextBookingId: SEED_BOOKINGS.length + 1,
  }
}
