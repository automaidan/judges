# А судді хто?

Цей репозиторій є вихідним кодом статичного сайт-генератора на якому побудований [http://prosud.info/](http://prosud.info/).

Під капотом — фронтенд на Angular~1.5 з TypeScript. Скреппер на Node.js~v5.12.0. Хостинг GitHub Pages.

Проект розвивається на волонтерських засадах для [Автомайдану](http://automaidan.org.ua/) та [Громадської ради доброчесності](http://vkksu.gov.ua/ua/gromadska-rada-dobrotchiesnosti/).


# Мета проекту

Систематизація та візуалізація данних з загальнодоступних джерел відносно якості роботи суддів України.

Данні беруться з:
* [Декларації ком уа](https://declarations.com.ua/)
* [НАЗК](https://public.nazk.gov.ua/)
* [Єдиний державний реєстр судових рішень](http://reyestr.court.gov.ua/); на данний момент [у роботі](https://github.com/automaidan/judges/issues/103)

# Development background
This is SPA with Google Sheets data storage (fetched during build process).
Key part of with project is declarations, that scrapped from http://declarations.com.ua/ (huge thanks to [@dchaplinsky](https://github.com/dchaplinsky)) during deployment process.
