# А судді хто?

Цей репозиторій є вихідним кодом статичного сайт-генератора на якому побудований [http://prosud.info/](http://prosud.info/).

# Hello world!

У травні 2016 року ми, активісти Всеукраїнського об’єднання «Автомайдан», вирішили розпочати проект, який дасть можливість кожному бажаючому долучитися до контролю суддів. До цього кроку нас підштовхнув повний саботаж справ щодо активістів Майдану та Автомайдану, які розглядалися у судах, відсутність покарань винних у переслідуванні і вбивстві активістів під час Революції гідності, в тому числі і серед суддів, які виносили неправомірні вироки. Ми хотіли, щоб кожен бажаючий міг викривати недоброчесних суддів та вимагати їх покарання.

З цією метою нами було розпочато проект «PROSUD» де вперше зібрали єдину базу відомостей щодо кожного з суддів України.

Зайшовши на сайт проекту (www.prosud.info) кожен може знайти потрібного йому суддю та побачити інформацію щодо його доходів та майнових статків опираючись на офіційні дані з його декларацій за 2013 (4) та 2015 роки. На сайті можна наочно побачити те, як зростали чи зменшувалися доходи та майно судді. І, що найважливіше, залишити інформацію щодо фактів недоброчесності конкретного судді. 

Інформація від людей з усієї України почала надходити вже в перший день проекту. Після надходження юристи нашої організації перевіряють дану інформацію, оформлюють та направляють до контролюючих та правоохоронних органів. За 9 місяців реалізації проекту Національне антикорупційне бюро  порушило кілька кримінальних справ на основі направлених нами заяв від людей.

Група проекту також постійно проводить власні розслідування щодо майна та статків суддів по всій Україні. В результаті виявлених нами недоброчесних суддів було також відкрито більше 5 кримінальних проваджень.

В листопаді 2016 року було створено унікальний в своєму роді орган – Громадську раду доброчесності. Завдяки зусиллям активістів вдалося домогтися реальних повноважень громадськості в процесі набору, атестації та звільнення суддів. Однак для того, щоб провести дійсне очищення судової системи, запустити роботу справедливого новоствореного Верховного суду потрібно зібрати та проаналізувати величезний масив інформації. Зокрема, це буде можливо завдяки налагодженій роботі проекту PROSUD, а для цього нам потрібна ваша допомога.
https://www.facebook.com/ProsudInfo/photos/a.1748817248727345.1073741828.1740082142934189/1841206819488387/?type=3&theater

Через збільшення кількості інформації зібраної на сайті необхідна ваша технічна допомога.

# Розвиток

Проект розвивається на волонтерських засадах для [Автомайдану](http://automaidan.org.ua/) та [Громадської ради доброчесності](http://vkksu.gov.ua/ua/gromadska-rada-dobrotchiesnosti/).

# Мета проекту

Систематизація та візуалізація данних з загальнодоступних джерел відносно якості роботи суддів України.

Данні беруться з:
* [Декларації ком уа](https://declarations.com.ua/)
* [НАЗК](https://public.nazk.gov.ua/)
* [Єдиний державний реєстр судових рішень](http://reyestr.court.gov.ua/); на данний момент [у роботі](https://github.com/automaidan/judges/issues/103)

# Development background

Під капотом — фронтенд на Angular 1.5 з TypeScript. Скреппер на Node.js v5.12.0. Хостинг GitHub Pages.

This is SPA with Google Sheets data storage (fetched during build process).
Key part of with project is declarations, that scrapped from http://declarations.com.ua/ (huge thanks to [@dchaplinsky](https://github.com/dchaplinsky)) during deployment process.
