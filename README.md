# Tuinman Jesse — websitepreview

Open `dist/index.html` rechtstreeks in je browser. Er zijn geen frameworks, installaties of buildstappen. Houd `style.css`, `script.js` en de map `assets` bij de HTML. Alle beelden en lettertypen zijn lokaal beschikbaar.

## Derde ontwerprichting

De volledige opdracht voor deze herziening staat in [ONTWERPPROMPT.md](ONTWERPPROMPT.md). De mobiele indeling vormt de basis. De hero vouwt tijdens het scrollen open naar drie foto's, waarna de middelste foto doorschuift naar de introductie van Tuinonderhoud. Daarna volgen drie uitklapbare diensten, Wie ben ik en een eenvoudig WhatsApp-contactformulier.

Binnenkomst: gemaskeerde titelregels. Scroll: een omkeerbare fotowaaier en foto-overgang, tekst- en beeldonthullingen. Diensten openen één voor één tijdens verder scrollen; na een handmatige keuze stopt die automatische voortgang. Foto's openen in een native dialoog met pijltjes, Escape en veegbediening. Op mobiel krijgt het fotoverschuiven een verticale compositie.

Alle beweging respecteert `prefers-reduced-motion`, ook bij een wijziging tijdens het bezoek. De scrollbediening blijft native. RequestAnimationFrame draait uitsluitend na scroll-, resize- of inhoudswijzigingen. Bij verminderde beweging, tekstvergroting en korte schermen wordt het verhaal een gewone verticale indeling. Native details en navigatie blijven zonder JavaScript bruikbaar; contact krijgt dan een directe WhatsApp-link.

## Contactformulier

De gebruiker koos WhatsApp naar Jesse. Naam, gekozen dienst en bericht worden samengevoegd in één `text`-parameter naar `https://wa.me/31629194822`. Alleen na insturen opent de bezoeker WhatsApp en kan daar zelf controleren en verzenden. De site verzendt geen bericht namens de bezoeker, bewaart geen invoer en claimt geen succesvolle verzending. De velden gebruiken native validatie, aangevuld met controle op uitsluitend spaties.

## Bedrijfsinformatie en beelden

Dit is een ontwerpvoorstel. Diensten en teksten zijn ter illustratie. Er worden geen reviews, werkgebied, keurmerken of ervaringsjaren geclaimd. Het telefoonnummer 0629194822 en het logo komen uit de aangeleverde afbeelding. Een ronde CSS-uitsnede toont uitsluitend het logo uit de oorspronkelijke screenshot.

De onderstaande bestanden zijn met de ingebouwde imagegen-tool gegenereerd en voor de website geoptimaliseerd. Het zijn sfeerbeelden, geen projecten of portretten van Jesse:

- `dist/assets/garden.webp`: rustige Nederlandse tuin met gazon, stapstenen, witte hortensia's, siergrassen en houten schutting.
- `dist/assets/snoeiwerk.webp`: anonieme handen met handschoenen en een handmatige heggenschaar. Er wordt geen identiteit of specifieke plantensoort geclaimd.
- `dist/assets/border.webp`: bloemenborder met paarse bloemen, lichte bloei en siergrassen in zacht zonlicht.
- `dist/assets/garden-patio.webp`: tuin met gazon, een licht terras en een houten bank, als tweede voorbeeld in de fotowaaier.

### Gebruikte beeldprompts

**Tuin:** Photorealistic editorial architectural garden photography for the right-hand hero panel of a clean modern Dutch gardener homepage. A beautifully maintained, believable Dutch residential garden at intimate scale: crisp green lawn, stepping-stone path leading from lower center into depth, soft ornamental grasses, clipped hedge, white flowering hydrangeas, subtle purple perennials, a slim multi-stem tree and a modern warm timber privacy fence. High-resolution square image fitting a near-square crop, eye-level view, interesting garden detail across the entire image. Late-summer gentle sunlight with leaf shadows, rich natural greens, warm wood, realistic plant textures, premium but accessible. No people, no dominant buildings, no text, no watermark. Avoid artificial plant textures and mansion-scale landscaping.

**Snoeiwerk:** Photorealistic-natural portrait mood photograph for a Dutch gardener's website. Close-up anonymous gloved hands using manual hedge shears to trim a dense dark green beech hedge. Only hands and olive work shirt sleeves visible; no face and no identifiable person. Photorealistic editorial garden photography, genuine candid gardener craft aesthetic. Portrait composition, intimate close-up, shallow depth of field, crisp believable leaves and correct tool geometry, hands naturally gripping the two handles of one pair of manual hedge shears. Warm natural daylight, tactile and calm. No faces, no person identity, no text, no logos, no watermarks.

**Border:** Photorealistic-natural portrait mood photograph for a Dutch gardener's website. An intimate natural planting border in a Dutch residential garden, foreground airy violet verbena and perennials, creamy white flowers and tall grasses with sunlight through foliage. Slightly blurred distant timber fence and garden lawn. Photorealistic editorial detail photography, tactile organic texture, beautiful but believable. Portrait composition with layered planting and shallow depth of field. Soft natural sun through foliage, rich deep natural greens. No people, no text, no logos, no watermarks.

**Extra tuinbeeld, prompt:** Use case: photorealistic-natural. Asset type: landscape garden photograph for a clearly labeled placeholder portfolio image in the scroll-unfold gallery of the Tuinman Jesse website; depict an illustrative garden, not a documented real client project. Do not add a label inside the image. Primary request: a photorealistic editorial photograph of a modest contemporary Dutch residential garden, with a tidy small square lawn, light limestone patio and stepping stones, neatly clipped hedges, warm timber fence and seating bench, a small multi-stem tree, white flowering borders and lush natural greens. Scene/backdrop: believable compact backyard of an ordinary Dutch home, carefully maintained and inviting, not a luxury mansion. Style/medium: realistic professional garden editorial photography with natural surface textures and believable planting. Composition/framing: landscape orientation, slightly elevated eye-level view that shows the lawn, patio, borders, tree and bench in one coherent garden composition. Lighting/mood: soft overcast summer daylight, calm and welcoming. Color palette: warm ivory stone, forest green foliage, natural warm timber. Constraints: exactly one image; no people, no text, no logos, no watermark, no luxury mansion.

## Lettertypen

Manrope en Instrument Serif zijn lokaal opgeslagen. De bijbehorende SIL Open Font Licenses staan in `dist/assets/OFL-Manrope.txt` en `dist/assets/OFL-Instrument-Serif.txt`.

## Controle

Visueel gecontroleerd in de browser op desktop en mobiel, inclusief de drie scrollmomenten bij 1440, 390 en 320 pixels. Menu, contactanker, fotodialoog, foto vooruit, Escape, scrollgestuurde diensten en verplichte formuliervelden gecontroleerd. Geen browserfouten tijdens deze controles. De samenstelling van WhatsApp-tekst is lokaal gecontroleerd met accenten, emoji, ampersand, nieuwe regels, lege velden en spaties; er is geen testbericht verstuurd. Lokale assets, ankerdoelen en JavaScript-syntax zijn gecontroleerd. Focus, leesvolgorde, onderbroken animaties en gewijzigde bewegingsvoorkeur zijn daarnaast in een afzonderlijke broncodereview nagekeken.
