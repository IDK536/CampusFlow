import type { Booking, BookingStatus, Room, User } from './types'
import { addDaysISO, todayISO } from '../data/timeGrid'

/** Seed из раздела 5 раздаточного материала с расширенной базой: 4 корпуса (A–D, как в ТЗ), 400 аудиторий, 60 пользователей. Пароль = логин. */
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

// 400 аудиторий: без контекстного типа, иначе TS не справляется с проверкой литерала (TS2590).
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
