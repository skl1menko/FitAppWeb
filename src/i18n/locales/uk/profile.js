const profile = {
    hero: {
        title: "Мій профіль",
        description: "Керуйте особистими даними, фото профілю та замірами тіла в одному місці.",
    },
    personalInfo: {
        title: "Особиста інформація",
        description: "Оновіть фото та ім’я, які відображаються в застосунку.",
        loading: "Завантаження профілю...",
        uploadAria: "Завантажити фото профілю",
        avatarAlt: "Профіль",
        photoTitle: "Фото профілю",
        photoDescription: "Завантажте квадратне зображення, щоб персоналізувати акаунт.",
        changePhoto: "Змінити фото",
        name: "Ім’я",
        namePlaceholder: "Введіть своє ім’я",
        email: "Зареєстрований email",
        emailPlaceholder: "Email",
    },
    measurements: {
        title: "Заміри тіла",
        description: "Зберігайте новий знімок своїх параметрів, щоб формувати історію змін.",
        progressTitle: "Прогрес замірів",
        progressDescription: "Відстежуйте, як змінюються ваші заміри тіла між збереженими знімками.",
        progressLoading: "Завантаження прогресу...",
        progressEmpty: "Історії замірів ще немає. Збережіть свої параметри, щоб почати відстеження.",
        fields: {
            height: "Зріст",
            weight: "Вага",
            chest: "Груди",
            waist: "Талія",
            hips: "Стегна",
            biceps: "Біцепс",
        },
        units: {
            cm: "см",
            kg: "кг",
        },
    },
    summary: {
        title: "Ваш підсумок",
        description: "Швидкий доступ до ключових особистих даних, збережених на цій сторінці.",
        name: "Ім’я",
        email: "Email",
        measurementsFilled: "Заповнено замірів",
        notSet: "Не вказано",
        tip: "Оновлюйте заміри регулярно, щоб легше відстежувати прогрес у майбутньому.",
        saving: "Збереження...",
        saveChanges: "Зберегти зміни",
    },
    errors: {
        loadProfileFailed: "Не вдалося завантажити профіль.",
        nameRequired: "Ім’я є обов’язковим.",
        saveProfileFailed: "Не вдалося зберегти профіль. Перевірте Cloudinary preset і доступність бекенду.",
    },
    success: {
        profileUpdated: "Профіль успішно оновлено.",
    },
};

export default profile;
