import{l as _}from"./chunks/loadSpec.PcaoG_iP.js";import{ad as p,z as i,J as s,K as n,y as r,x as o,u as a,F as l,N as d,ab as g}from"./chunks/framework.C80sNVRy.js";import"./chunks/theme.BUbyoYV_.js";const b="/docs/pr/28/images/devices/zero/overview.png",y="/docs/pr/28/images/devices/zero/leds.png",f="/docs/pr/28/images/devices/general/status-battery.png",v="/docs/pr/28/images/devices/general/status-gps.png",w="/docs/pr/28/images/devices/general/status-gsm.png",S=`product:
  name: "Zero"
  description: "Our smallest core GPS tracking device."
  usage: "For tracking non powered assets, where you have a size or weight restriction"
  sku: ZE2
  prefix: 19
  version: 2
  images:
  - "https://upload.r2.lb.chasm.cloud/2025/raw-renders/2025-07-01/lightbug-zero-front angle.png?x=600&y=400&w=600&h=500"
  - "https://upload.r2.lb.chasm.cloud/2025/raw-renders/2025-07-01/lightbug-zero-top side.png?x=600&y=400&w=600&h=500"
  - "https://upload.r2.lb.chasm.cloud/2025/raw-renders/2025-07-01/lightbug-zero-back.png?x=650&y=400&w=600&h=500"
  - "https://upload.r2.lb.chasm.cloud/2025/raw-renders/2025-07-01/lightbug-zero-side.png?x=700&y=570&w=600&h=500"
  physical:
    size:
      dimensions_mm: "56 x 37 x 12.9"
      weight_g: 35
    certifications:
    - "CE"
    rating:
      ip: "IP66"
      ik: "Shockproof"
      operating temperature_c: "0 to +50"
  integrations:
  cloud:
    supported_platforms:
    - "Lightbug Cloud (Hosted or On-premise)"
    - "Other clouds supported via Forwarding"
    native_protocols:
    - "UDP"
    - "TCP"
    forwarding_protocols:
    - "MQTT"
    - "HTTP(S)"
    - "WebSocket"
  connectivity:
    cellular:
      technologies:
      - "LTE CAT-M1"
      - "GPRS"
      - "EDGE"
      territory: "Global"
      bands:
        LTE_FDD:
          - B1
          - B2
          - B3
          - B4
          - B5
          - B8
          - B12
          - B13
          - B18
          - B19
          - B20
          - B26
          - B28
        LTE_TDD:
          - B39
        gsm:
          - 850MHz
          - 900MHz
          - 1800MHz
          - 1900MHz
    bluetooth-le:
      technologies:
      - "Low Power Broadcasting (iBeacon)"
      - "Gateway Scanning"
      - "Child (peripheral) device"
      territory: "Global"
      version: "5.4"
  positioning:
    gnss:
      typical_accuracy_meters: 1-5
      technologies:
      - "GPS"
      - "GLONASS"
      - "BeiDou"
      constellations:
        GPS:
          bands:
            L1: 1575.42
        GLONASS:
          bands:
            L1: "1602 + n x 0.5625 (n=-7,...6)"
        BeiDou:
          bands:
            L1: 1575.42
    wifi:
      typical_accuracy_meters: 10-30
      technologies:
      - "2.4Ghz Wi-Fi AP scanning"
  sensors:
    accelerometer:
      typical_accuracy_g: 0.01
      features:
      - "3-axis accelerometer"
      - "Motion Detection"
      - "Orientation & Tilt detection"
      - "Shock and Vibration detection"
    temperature:
      typical_accuracy_c: 5
      features:
      - "Temperature Sensing (low accuracy)"
      - "Thermal Protection"
  charging:
    inputs:
      voltage_range_v: "5-14"
      current_limit_a: "0.1 to 3.25"
    features:
      fast_charge: "5-14V input with Fast Charge support"
      configurable: "Configurable draw and charge rates"
  user interface:
    buttons:
      "Multi-purpose":
        - "Status Check"
        - "Trigger Update"
        - "Software Reset"
        - "Hardware Reset"
    leds:
      "Status":
        - "Single Color LED x4"
        - "Indicates device status (battery level, charging, connected, etc.)"
  components:
    cellular:
      manufacturer: "SIMCom Wireless Solutions Limited"
      model: "SIM7000G"
      specifications:
        supported_technologies:
        - "LTE CAT-M1"
        - "LTE NB-IoT"
        - "GPRS"
        - "EDGE"
        frequency_bands:
          gsm:
            bands: "850/900/1800/1900MHz"
            egsm_900mhz:
              transmit_frequency_mhz: "880-915"
              receive_frequency_mhz: "925-960"
            dcs_1800mhz:
              transmit_frequency_mhz: "1710-1785"
              receive_frequency_mhz: "1805-1880"
          lte_cat_m1:
            bands: "B1/B2/B3/B4/B5/B8/B12/B13/B18/B19/B20/B26/B28/B39"
          lte_nb_iot:
            bands: "B1/B2/B3/B5/B8/B12/B13/B17/B18/B19/B20/B26/B28"
        data_transfer_rates_kbps:
          cat_m_dl: 300
          cat_m_ul: 375
          cat_nb_dl: 34
          cat_nb_ul: 66
          egprs_dl: 85.6 # This is a comment
          egprs_ul: 85.6
          edge_dl_ul: 236.8
          gprs_dl_ul: 85.6
        supply_voltage_range_v: "3.0 ~ 4.3"
        power_consumption_typical:
          power_off_ua: 7
          psm_ua: 9
          sleep_ma: 1 # Another comment
          idle_ma: 11
        temperature_range_c: "-40 ~ +85"
        certifications:
        - "FCC"
        - "IC"
        - "CE"
        - "3C"
        - "GCF"
        - "RoHS"
        - "REACH"
        - "RCM"
        - "PTCRB"
    bluetooth-le:
      manufacturer: "STMicroelectronics"
      model: "STM32WB55xx"
      specifications:
        chip_type: "Multiprotocol wireless 32-bit MCU Arm®-based Cortex®-M4 with FPU"
        radio_features:
          frequency: "2.4 GHz"
          bluetooth_specification: "5.4"
          ieee_802_15_4_support: "Yes (supports PHY and MAC, supporting Thread 1.3 and Zigbee® 3.0)"
          rx_sensitivity_dbm:
            bluetooth_le_1mbps: -96
            ieee_802_15_4: -100
          programmable_output_power_dbm: "+6 (with 1 dB steps)"
          integrated_balun: "Yes"
          data_rates_mbps: "1, 2"
          dedicated_radio_cpu: "Arm® 32-bit Cortex® M0+"
          external_pa_support: "Yes"
        memory:
          flash_memory_size: "Up to 1 Mbyte"
          sram_size: "Up to 256 Kbytes (includes 64 K SRAM1 and 64 K SRAM2 for STM32WB55Cx models)"
        operating_voltage_v: "1.71 to 3.6"
        operating_temperature_c: "-40 to +85 and -40 to +105 (Ambient)"
        power_consumption_typical_ma_at_3_3v:
          tx_max_output_bluetooth_le: 7.8
          tx_max_output_802_15_4: 6.5
          rx_bluetooth_le: 4.5
          rx_802_15_4: 4.5
          run_mode_flash_64mhz_typical_ma: 8.80
    gnss:
      specifications:
        gnss_systems:
        - "GPS"
        - "BeiDou"
        - "GLONASS"
        receiver_type:
          channels: "16-channel"
          code: "C/A Code"
        sensitivity:
          tracking:
            GPS: -162 dBm
            GLONASS: -157 dBm
            BeiDou: unknown
          cold_starts: -148 dBm
        time_to_first_fix:
          cold_starts: "<35s"
          hot_starts: "<1s"
        accuracy:
          position: "<2.5m CEP"
    wifi:
      manufacturer: "Espressif Systems"
      model: "ESP8285"
      specifications:
        soc_description: "Highly integrated Wi-Fi SoC solution for IoT industry (can perform as a standalone application or as the slave to a host MCU)"
        recommended_upgrade: "ESP8684"
        wi_fi_protocols: "802.11 b/g/n (HT20)"
        wi_fi_frequency_range_mhz: "2400 ~ 2483.5"
        tx_power_dbm:
          802_11b: "+19"
          802_11g_6mbps: "+19"
          802_11g_54mbps: "+15"
          802_11n_mcs0: "+19"
          802_11n_mcs7: "+14"
        rx_sensitivity_dbm:
          802_11b_1mbps: "-97"
          802_11g_54mbps: "-74"
          802_11n_mcs7: "-70"
        cpu: "Tensilica L106 32-bit processor (up to 160 MHz)"
        memory: "1 MB"
        operating_voltage_v: "2.7 ~ 3.6"
        crystal_frequency_range_mhz: "24 ~ 52"
        power_consumption_deep_sleep_ua: 20
        power_consumption_active_ma:
          average: 80
          tx_802_11b_19dbm: 197
          rx_802_11b: 73
          modem_sleep_typical: "~15 (DTIM3, 300ms sleep/3ms wakeup)"
          light_sleep_typical: "~0.9 (DTIM3, 300ms sleep/3ms wakeup)"
    accelerometer:
      manufacturer: "STMicroelectronics"
      model: "LIS3DHTR"
      specifications:
        device_type: "MEMS digital output motion sensor: ultra-low-power high-performance 3-axis 'nano' accelerometer"
        data_output: "16-bit"
        full_scale_range: "±2g/±4g/±8g/±16g (dynamically selectable)"
        supply_voltage_v: "1.71 to 3.6"
        operating_temperature_c: "-40 to +85"
        power_consumption_ulp_ua: "down to 2 (normal mode at 1 Hz ODR)"
    charger:
      manufacturer: "Texas Instruments"
      model: "BQ25890H"
      specifications:
        description: "I2C Controlled Single Cell 5-A Fast Charger with MaxChargeTM Technology"
        charge_current_a: "5 (Fast charge current, adjustable from 128mA to 5056mA)"
        charge_efficiency_percent:
          at_2a: 93
          at_3a: 91
        usb_otg_output_v: "4.5 to 5.5 (adjustable)"
        usb_otg_output_current_a: "2.4"
        boost_efficiency_percent: "93 (at 5V, 1A output)"
        input_voltage_range_v: "3.9 to 14"
        input_current_limit_a: "0.1 to 3.25 (50-mA resolution, automatically set by source detection)"
        battery_discharge_mosfet_resistance_mohm: 11
        battery_discharge_current_a: "up to 9 (peak, up to 1 sec duration)"
        integrated_adc_for_monitoring:
        - "Voltage"
        - "Temperature"
        - "Charge Current"
        power_path_management: "Narrow VDC (NVDC), with automatic power path selection"
        operating_temperature_c: "-40 to 85"
  battery:
    overall:
      capacity_mah: 1000
      pack_configuration: "1S1P"
      voltage_v: 3.7
    cells:
      type: "603050"
      spec:
        model: "603050"
        type: "Lithium Polymer Battery"
        nominal_voltage_v: 3.7
        nominal_capacity_mah: 1000
        nominal_energy_wh: 3.7
        certifications_and_tests:
          standard: "UN38.3 (UNITED NATIONS 'Recommendations on the TRANSPORT OF DANGEROUS GOODS' Manual of Tests and Criteria ST/SG/AC.10/11/Rev.6)"
          tests:
            "Altitude simulation": "No leakage, no venting, no disassembly, no rupture & no fire"
            "Thermal test": "No leakage, no venting, no disassembly, no rupture & no fire"
            "Vibration": "No leakage, no venting, no disassembly, no rupture & no fire"
            "Shock": "Included as a test item in the UN38.3 report"
            "External short circuit": "No disassembly, no rupture & no fire (Max external temperature: 57.6 ~ 57.9°C)"
            "Impact": "No disassembly & no fire (Max external temperature: 106.9 ~ 129.2°C)"
            "Forced discharge": "No disassembly & no fire"
`,D=JSON.parse('{"title":"Zero (ZE2)","description":"","frontmatter":{"aside":true},"headers":[],"relativePath":"devices/zero/index.md","filePath":"devices/zero/index.md"}'),x={name:"devices/zero/index.md"},E=Object.assign(x,{setup(B){const t=_(S);return(T,e)=>{const u=p("DownloadSpecButton"),m=p("DeviceSpecImages"),h=p("DeviceSpecOverview"),c=p("DeviceSpecSection");return i(),s("div",{"data-pagefind-body":!0,"data-pagefind-meta":"date:1792832162000"},[e[9]||(e[9]=n("h1",{id:"zero-ze2",tabindex:"-1"},[r("Zero (ZE2) "),n("a",{class:"header-anchor",href:"#zero-ze2","aria-label":'Permalink to "Zero (ZE2)"'},"​")],-1)),o(u,{spec:a(t),deviceTitle:"Zero (ZE2)"},null,8,["spec"]),e[10]||(e[10]=n("h2",{id:"images",tabindex:"-1"},[r("Images "),n("a",{class:"header-anchor",href:"#images","aria-label":'Permalink to "Images"'},"​")],-1)),o(m,{spec:a(t)},null,8,["spec"]),e[11]||(e[11]=n("h2",{id:"overview",tabindex:"-1"},[r("Overview "),n("a",{class:"header-anchor",href:"#overview","aria-label":'Permalink to "Overview"'},"​")],-1)),o(h,{spec:a(t)},null,8,["spec"]),a(t).product.physical?(i(),s(l,{key:0},[e[0]||(e[0]=n("h2",{id:"physical",tabindex:"-1"},[r("Physical "),n("a",{class:"header-anchor",href:"#physical","aria-label":'Permalink to "Physical"'},"​")],-1)),o(c,{spec:a(t),sectionName:"physical"},null,8,["spec"])],64)):d("",!0),a(t).product.integrations?(i(),s(l,{key:1},[e[1]||(e[1]=n("h2",{id:"integrations",tabindex:"-1"},[r("Integrations "),n("a",{class:"header-anchor",href:"#integrations","aria-label":'Permalink to "Integrations"'},"​")],-1)),o(c,{spec:a(t),sectionName:"integrations"},null,8,["spec"])],64)):d("",!0),a(t).product["user interface"]?(i(),s(l,{key:2},[e[2]||(e[2]=n("h2",{id:"user-interface",tabindex:"-1"},[r("User Interface "),n("a",{class:"header-anchor",href:"#user-interface","aria-label":'Permalink to "User Interface"'},"​")],-1)),o(c,{spec:a(t),sectionName:"user interface"},null,8,["spec"])],64)):d("",!0),a(t).product.connectivity?(i(),s(l,{key:3},[e[3]||(e[3]=n("h2",{id:"connectivity",tabindex:"-1"},[r("Connectivity "),n("a",{class:"header-anchor",href:"#connectivity","aria-label":'Permalink to "Connectivity"'},"​")],-1)),o(c,{spec:a(t),sectionName:"connectivity"},null,8,["spec"])],64)):d("",!0),a(t).product.positioning?(i(),s(l,{key:4},[e[4]||(e[4]=n("h2",{id:"positioning",tabindex:"-1"},[r("Positioning "),n("a",{class:"header-anchor",href:"#positioning","aria-label":'Permalink to "Positioning"'},"​")],-1)),o(c,{spec:a(t),sectionName:"positioning"},null,8,["spec"])],64)):d("",!0),a(t).product.sensors?(i(),s(l,{key:5},[e[5]||(e[5]=n("h2",{id:"sensors",tabindex:"-1"},[r("Sensors "),n("a",{class:"header-anchor",href:"#sensors","aria-label":'Permalink to "Sensors"'},"​")],-1)),o(c,{spec:a(t),sectionName:"sensors"},null,8,["spec"])],64)):d("",!0),a(t).product.battery?(i(),s(l,{key:6},[e[6]||(e[6]=n("h2",{id:"battery",tabindex:"-1"},[r("Battery "),n("a",{class:"header-anchor",href:"#battery","aria-label":'Permalink to "Battery"'},"​")],-1)),o(c,{spec:a(t),sectionName:"battery"},null,8,["spec"])],64)):d("",!0),a(t).product.charging?(i(),s(l,{key:7},[e[7]||(e[7]=n("h2",{id:"charging",tabindex:"-1"},[r("Charging "),n("a",{class:"header-anchor",href:"#charging","aria-label":'Permalink to "Charging"'},"​")],-1)),o(c,{spec:a(t),sectionName:"charging"},null,8,["spec"])],64)):d("",!0),a(t).product.components?(i(),s(l,{key:8},[e[8]||(e[8]=n("h2",{id:"components",tabindex:"-1"},[r("Components "),n("a",{class:"header-anchor",href:"#components","aria-label":'Permalink to "Components"'},"​")],-1)),o(c,{spec:a(t),sectionName:"components"},null,8,["spec"])],64)):d("",!0),e[12]||(e[12]=g('<h2 id="exterior" tabindex="-1">Exterior <a class="header-anchor" href="#exterior" aria-label="Permalink to &quot;Exterior&quot;">​</a></h2><img src="'+b+'" style="max-height:300px;max-width:300px;"><img src="'+y+'" style="max-height:300px;max-width:300px;"><h2 id="led-indicators" tabindex="-1">LED Indicators <a class="header-anchor" href="#led-indicators" aria-label="Permalink to &quot;LED Indicators&quot;">​</a></h2><p>The small icons above each of the indicators show what information they display.</p><p>These indicators can light up while transmitting, or as the result of a button press.</p><table tabindex="0"><thead><tr><th>Icon</th><th>Name</th><th>Description</th></tr></thead><tbody><tr><td><img src="'+f+'" alt="Battery symbol" width="20" height="20"></td><td>Battery</td><td>The current charge of the tracker with 1-4 LEDs glowing solid orange.<br><br> 🟧 1 LED: 0%-25%<br> 🟧🟧 2 LEDs: 25%-50%<br> 🟧🟧🟧 3 LEDs: 50%-75%<br> 🟧🟧🟧🟧 4 LEDs: 75%-100%</td></tr><tr><td><img src="'+v+'" alt="GPS symbol" width="20" height="20"></td><td>GPS signal*</td><td>🟧 Solid orange when operational<br> 🟥 Solid red when GPS is unavailable<br><br>It is normal for GPS to be unavailable when the tracker is indoors.</td></tr><tr><td><img src="'+w+'" alt="GSM symbol" width="20" height="20"></td><td>GSM signal*</td><td>🟧 Solid orange when operational<br> 🟥 Solid red when GSM is unavailable<br><br>GSM may not be available in areas with poor cell phone coverage.</td></tr></tbody></table><p>*The signal indicators are primarily for diagnostic purposes.</p><h2 id="buttons" tabindex="-1">Buttons <a class="header-anchor" href="#buttons" aria-label="Permalink to &quot;Buttons&quot;">​</a></h2><p>The device has a single button that can be used to trigger different events.</p><table tabindex="0"><thead><tr><th>Trigger</th><th>Indication</th><th>Event</th><th>Details</th></tr></thead><tbody><tr><td>&lt; 1 second</td><td>Battery and status LEDs will light up</td><td></td><td>Shows you current status</td></tr><tr><td>1-3 second</td><td>The battery LEDs will flash from left to right in a cycle, and you will hear a small beep.</td><td>Send button press event &amp; location</td><td>Initially sending an immediate location, followed by a more accurate location once found.</td></tr><tr><td>15 second</td><td>The battery LEDs may go blank for a second, but then will flash from left to right in a cycle, and you will hear a small beep.</td><td>Hard reset</td><td>Recommended if you are experiencing network related performance issues</td></tr></tbody></table><h2 id="charging-1" tabindex="-1">Charging <a class="header-anchor" href="#charging-1" aria-label="Permalink to &quot;Charging&quot;">​</a></h2><p>The Zero tracker is charged using a magnetic 4 pin connector, and should be charged for 3 hours before initial use.</p><p>This connecter can be used with a magnetic cable or a zero charging dock.</p><table tabindex="0"><thead><tr><th>State</th><th>Indication</th></tr></thead><tbody><tr><td>Disconnected</td><td>No LEDs will be on</td></tr><tr><td>Connected, Charging</td><td>Battery LEDs display the charge of the device, and will blink while charging</td></tr><tr><td>Connected, Fully charged</td><td>Battery LEDs display the charge of the device, no blinking will happen</td></tr></tbody></table><div class="warning custom-block"><p class="custom-block-title">⚠️ Warning</p><p>It is advised to use an adapter plugged into a power socket rather than using a computer USB port or similar.</p></div>',16))])}}});export{D as __pageData,E as default};
