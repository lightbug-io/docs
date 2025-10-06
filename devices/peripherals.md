# Peripherals

Our devices work with a number of peripherals to help you get the most out of your project.

These includes peripherals custom to a device type, such as a Keyring attachment for a Lightbug Zero, or a charging dock for the Lightbug Pro, as well as third party peripherals such as sensors.

## Bluetooth

These beacons provide convenient markers for locations, devices, vehicles, people and other assets.

- `lb-acc-mi7` - Bluetooth beacon with up to 240m range ([product listing](https://lightbug.io/product/lb-acc-me2/))
- `lb-acc-mi7` - Bluetooth beacon with up to 100m range ([product listing](https://lightbug.io/product/lb-acc-mi7/))
- `lb-acc-c10` - Bluetooth card ([product listing](https://lightbug.io/product/lb-acc-c10/))

These sensors can be used to monitor the environment, and submit additional information alongside location datapoints.

- `lb-acc-ms1` Bluetooth Temperature & Humidity Sensor ([product listing](https://lightbug.io/product/lb-acc-ms1/))

If you are interested in further bluetooth compatibility or sensors, please [contact us](https://lightbug.io/contact/).

<v-row>
    <v-col
        v-for="(image, index) in [
            'https://upload.r2.lb.chasm.cloud/2025/10/shop/LB-ACC-MS1.webp',
            'https://upload.r2.lb.chasm.cloud/2025/10/shop/LB-ACC-ME2.webp',
            'https://upload.r2.lb.chasm.cloud/2025/10/shop/LB-ACC-MI7.webp',
            'https://upload.r2.lb.chasm.cloud/2025/10/shop/LB-ACC-C10.webp',
        ]"
        :key="index"
        class="d-flex child-flex"
        :cols="3"
    >
        <v-img :lazy-src="image" :src="image"></v-img>
    </v-col>
</v-row>
