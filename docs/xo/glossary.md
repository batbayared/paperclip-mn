# XO орчуулгын толь бичиг (glossary)

Хэрэглээ: `ui/src/i18n/xo/mn.json`-ийн орчуулга бүр энэ толийг баримтална. Толинд байхгүй нэр томьёо гарвал эхлээд энд мөр нэмж commit хийгээд дараа нь орчуулна. ED батлаагүй нэр томьёоны өөрчлөлт хүчингүй.

## Хэв маяг

- Хэрэглэгчид «та» хэлбэрээр; албан боловч хуурай биш.
- Товчлуур, цэс: үйл үгийн захирах хэлбэр, богино («Үүсгэх», «Хадгалах»; «Үүсгэнэ үү» биш).
- Техникийн нэр англиар үлдэнэ: API key → «API түлхүүр» гэхдээ API, token/токен, heartbeat, Claude Code, Codex, GitHub, URL, JSON, Slack, Discord, Telegram. Латин үлдэгдлийн шалгалт (Task 11 Step 14) зөвхөн эдгээрийг зөвшөөрнө.
- Орлуулагч (`{{name}}`, `{{count}}`, `{{brand}}`) үсэг үсгээр нь хэвээр; байрлалыг монгол өгүүлбэрийн дарааллаар зөөж болно.
- Олон тооны хос (`_one` / `_other`) хоёулаа орчуулагдана; монголд хоёр утга давхцаж болно.
- `{{brand}}` = XO. «Paperclip» гэдэг үг ямар ч орчуулгад орохгүй.
- Цэг, таслал, олон цэг, асуултын тэмдэг эх текстийнхтэй ижил тоогоор.

## Нэр томьёо

| Англи | Монгол | Тайлбар |
|---|---|---|
| organization / Org | байгууллага | «Org» товчлол ч байгууллага |
| company | компани | UI-д organization-той зэрэгцэн хэрэглэгддэг тул ялгааг хадгална |
| agent | агент | |
| task / issue | даалгавар | «issue» = даалгавар, алдаа биш |
| goal | зорилго | |
| project | төсөл | |
| approval | зөвшөөрөл | |
| heartbeat | heartbeat | техникийн нэр, орчуулахгүй |
| run | ажиллагаа | агентын нэг удаагийн гүйцэтгэл |
| budget | төсөв | |
| cost | зардал | |
| workspace | ажлын талбар | |
| execution workspace | гүйцэтгэлийн талбар | |
| inbox | ирсэн | цэсний нэр; урт хэлбэр «ирсэн зүйлс» |
| decision | шийдвэр | |
| activity | үйл ажиллагаа | |
| audit | аудит | |
| dashboard | хянах самбар | |
| routine | тогтмол ажил | |
| pipeline | пайплайн | |
| artifact | артефакт | |
| skill | чадвар | |
| connector / app | холбогч / апп | |
| settings | тохиргоо | |
| instance | инстанс | |
| member | гишүүн | |
| invite | урилга | үйл үг бол «урих» |
| sign in / sign up / sign out | нэвтрэх / бүртгүүлэх / гарах | |
| email / password | имэйл / нууц үг | |
| model | модел | AI модел |
| adapter | адаптер | |
| API key | API түлхүүр | |
| token | токен | |
| status | төлөв | |
| pending / approved / rejected | хүлээгдэж буй / зөвшөөрсөн / татгалзсан | |
| active / paused / archived | идэвхтэй / түр зогссон / архивласан | |
| Create / Save / Cancel / Delete | Үүсгэх / Хадгалах / Болих / Устгах | товчлуур |
| Continue / Back / Next / Done | Үргэлжлүүлэх / Буцах / Дараах / Дууссан | |
| search | хайх | цэсэнд «Хайх», нэр үг бол «хайлт» |
| Loading… | Ачаалж байна… | |
| error / warning / success | алдаа / анхааруулга / амжилттай | |
| new / edit / view / open / retry | шинэ / засах / харах / нээх / дахин оролдох | |
| comment | сэтгэгдэл | |
| assignee / owner | хариуцагч / эзэмшигч | |
| priority | эрэмбэ | |
| due date | дуусах хугацаа | |
| description | тайлбар | |
| title / name | гарчиг / нэр | |
| tag / label | шошго | |
| filter / sort | шүүлт / эрэмбэлэх | |
| conference room | хурлын өрөө | |
| review queue | хянах дараалал | |
| learnings | сургамж | |
| case | кейс | |
| plugin | плагин | |
| timeline | цагийн хэлхээ | |
| notification | мэдэгдэл | |
| onboarding | эхний тохиргоо | onboarding wizard = «эхний тохиргооны туслах» |
| Start Onboarding | Тохиргоог эхлүүлэх | e2e-д ашиглагдана |
| Build a new organization | Шинэ байгууллага үүсгэх | e2e-д ашиглагдана |
| Add Agent | Агент нэмэх | |
| New Organization | Шинэ байгууллага | |
| New Task | Шинэ даалгавар | Sidebar (Task 9) |
| Let's get started... | За, эхэлцгээе... | OnboardingWizard lede; `{{brand}}` хэвээр |

## Ү6 7.1-д нэмсэн (ED хянах)

| en | mn | Тэмдэглэл |
|---|---|---|
| run | ажиллагаа | агентын нэг гүйлт |
| runner | гүйцэтгэгч | |
| board | Удирдах зөвлөл | «Interrupted by board» |
| sub-task | дэд даалгавар | |
| revision | хувилбар | Plan/Artifact |
| steering | чиглүүлэлт | |
| Auto/Plan/Ask mode | Авто/Төлөвлөх/Асуух горим | work mode |
| provider | үйлчилгээ үзүүлэгч | загварын үйлчилгээ |

## Ү6 7.2-т шийдсэн (ED 2026-10-13-нд батлав)

Өөрчилсөн (mn.json-д орсон):

| en | Хуучин | Шинэ | Тэмдэглэл |
|---|---|---|---|
| Blocked by | Саатуулж буй | Саатуулагч | blocker = саатуулагч |
| Blocking | Саатуулж байгаа | Саатуулж буй | |
| Show less | Багаар харуулах | Хураах | |
| Subtree is paused. | Дэд мөч түр зогссон. | Дэд даалгаврууд түр зогссон. | subtree = дэд даалгаврууд («мөчир» хэрэглэхгүй) |
| Resume subtree | Дэд мөчрийг үргэлжлүүлэх | Дэд даалгавруудыг үргэлжлүүлэх | «Resume this subtree to send a message.» мөн нийцүүлсэн |
| Binding | Холбоос | Холболт | link = холбоос |
| Runtime input | Ажиллах орчны оруулалт | Гүйцэтгэлийн оролт | |
| Lease | Түрээс | Түр эзэмшил | |
| Referenced files | Файлд хандсан | Иш татсан файлууд | |
| Used connected tools | Холбогдсон хэрэгсэл ашигласан | Холбогч ашигласан | connector = холбогч |
| Ran hooks | Hook ажиллуулсан | Hook ажиллуулав | |

Хэвээр үлдээсэн:

| en | mn | Тэмдэглэл |
|---|---|---|
| filter / Filter | шүүлт / Шүүх | «шүүлтүүр» хэрэглэхгүй |
| workspace | ажлын талбар | execution workspace = гүйцэтгэлийн талбар |
| blocker | саатуулагч | |
| panel | самбар | хянах самбар, хажуугийн самбар; board-д хэрэглэхгүй |
| Depth | Гүн | модны түвшний гүн |
| steer / steering | чиглүүлэх / чиглүүлэлт | |
| Interrupted | Тасалдсан | үйл үг: Тасалдуулах |
| Deferred wake | Хойшлуулсан сэрээлт | |
| For (assignee) | Хэнд | w-6 өргөнд «Хариуцагч» багтахгүй |
| ctx | контекст | таслагдвал латин ctx-ийг keep-en.json-д |

## Sidebar-ын 27 түлхүүр (Task 9-д орчуулсан, өөрчлөхгүй)

Activity → Үйл ажиллагаа; Agents → Агентууд; Artifacts → Артефактууд; Audit → Аудит; Cases → Кейсүүд; Company → Компани; Conference Room → Хурлын өрөө; Connectors → Холбогчид; Costs → Зардал; Dashboard → Хянах самбар; Decisions → Шийдвэрүүд; Goals → Зорилгууд; Inbox → Ирсэн; New Task → Шинэ даалгавар; Org → Байгууллага; Organization → Байгууллага; Pipelines → Пайплайнууд; Projects → Төслүүд; Routines → Тогтмол ажлууд; Search → Хайх; Settings → Тохиргоо; Skills → Чадварууд; Status → Төлөв; Tasks → Даалгаврууд; Timeline → Цагийн хэлхээ; Work → Ажил; Workspaces → Ажлын талбарууд.
