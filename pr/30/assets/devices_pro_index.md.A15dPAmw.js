import{l as f}from"./chunks/loadSpec.CoKjjqQk.js";import{ad as c,z as b,J as v,K as n,y as t,x as a,C as u,u as o,c as y}from"./chunks/framework.plagcClB.js";import"./chunks/theme.XN4Uuh6m.js";const w=`product:
  name: Pro
  description: Our most rugged and long-life tracker for harsh environments.
  sku: PR3
  prefix: 52
  version: 3
  images:
  - https://upload.r2.lb.chasm.cloud/2025/raw-renders/2025-07-01/lightbug-pro-front angle.png?x=600&y=200&w=600&h=700
  - https://upload.r2.lb.chasm.cloud/2025/raw-renders/2025-07-01/lightbug-pro-top side.png?x=600&y=200&w=600&h=700
  - https://upload.r2.lb.chasm.cloud/2025/raw-renders/2025-07-01/lightbug-pro-back.png?x=650&y=200&w=600&h=700
  - https://upload.r2.lb.chasm.cloud/2025/raw-renders/2025-07-01/lightbug-pro-side.png?x=700&y=370&w=600&h=700
  physical:
    size:
      dimensions_mm: 85 x 44 x 28.4
      weight_g: 150
    certifications:
    - CE
    rating:
      ip: IP66
      operating temperature_c: -20 to +60
  integrations:
    cloud:
      supported_platforms:
      - Lightbug Cloud (Hosted or On-premise)
      - Other clouds supported via Forwarding
      native_protocols:
      - UDP
      - TCP
      forwarding_protocols:
      - MQTT
      - HTTP(S)
      - WebSocket
    on_device:
      co_processor: ESP32-C6
      control: Control of device via APIs
      supported_platforms:
      - Toit (micro-containers)
      - Arduino
      - PlatformIO
      - Espressif IDF
  connectivity:
    cellular:
      technologies:
      - LTE CAT-1
      - GPRS
      - EDGE
      territory: Global
      bands:
        LTE_FDD:
        - B1
        - B2
        - B3
        - B4
        - B5
        - B7
        - B8
        - B12
        - B13
        - B18
        - B19
        - B20
        - B25
        - B26
        - B28
        - B66
        LTE_TDD:
        - B38
        - B39
        - B40
        - B41
        GSM:
        - 850MHz
        - 900MHz
        - 1800MHz
        - 1900MHz
    bluetooth-le:
      version: '5.3'
      roles:
      - Host
      - Peripheral
    wifi:
      version: 802.11ax
      frequency: 2.4GHz
      wifi_generation: Wi‑Fi 6
    lora:
      frequency_bands_mhz:
      - 868
      - 915
      regions:
      - EU868
      - US915
      - AU915
      p2p: 'yes'
      loRaWAN: Hardware capable; requires compatible firmware
      notes: Regional frequency plan, transmit power and duty-cycle limits apply.
    thread:
      version: IEEE 802.15.4
      notes: ESP32-C6 hardware capability; requires compatible firmware
    zigbee:
      version: IEEE 802.15.4
      notes: ESP32-C6 hardware capability; requires compatible firmware
  positioning:
    gnss:
      description: Multi-constellation GNSS
      technologies:
      - GPS
      - GLONASS
      - Galileo
      - BeiDou
      - QZSS
      chipset: Quectel LC79H
      supported_update_rate: 1 Hz (module default)
    wifi:
      typical_accuracy_meters: 10-30
      technologies:
      - 2.4Ghz Wi-Fi AP scanning
      notes: RSSI-based positioning using nearby Wi-Fi access points; accuracy depends on coverage and
        environment.
    bluetooth:
      technologies:
      - Bluetooth LE beacon scanning
      notes: RSSI-based positioning with suitable beacon infrastructure; accuracy depends on deployment
        and environment.
  sensors:
    accelerometer:
      typical_accuracy_g: 0.01
      features:
      - 3-axis accelerometer
      - Motion Detection
      - Orientation & Tilt detection
      - Shock and Vibration detection
      range_g_force: ±2g/±4g/±8g/±16g
      modules:
      - 3-axis accelerometer (main CPU)
    temperature (optional):
      availability: Optional
      description: Temperature sensing
    pressure (optional):
      availability: Optional
      description: Barometric pressure sensing
      range_hpa: 300 to 1100
    humidity (optional):
      availability: Optional
      description: Relative humidity sensing
  charging:
    inputs:
      voltage_range_v: 5-13.5
      current_limit_a: 0.1 to 3.2
      current_limit_at_12v_or_above_a: 2
    features:
      fast_charge: 3A-class switching charger
      configurable: Configurable draw and charge rates
      usb_c: true
      notes: Automatic power-path management. Actual charge rate depends on input source, battery and
        thermal conditions.
  user interface:
    buttons:
      Multi-purpose:
      - Status Check
      - Trigger Update
      - Software Reset
      - Hardware Reset
    leds:
      Status:
      - Single Color LED x4
      - Indicates device status (battery level, charging, connected, etc.)
    piezo:
      type: Piezo buzzer
      purpose: Audible alerts
  components:
    cellular:
      manufacturer: SIMCom Wireless Solutions Limited
      model: A7672G
      specifications:
        supported_technologies:
        - LTE CAT-1 (bis)
        - GPRS
        - EDGE
        frequency_bands:
          gsm:
            bands: 850/900/1800/1900MHz
            egsm_900mhz:
              transmit_frequency_mhz: 880-915
              receive_frequency_mhz: 925-960
            dcs_1800mhz:
              transmit_frequency_mhz: 1710-1785
              receive_frequency_mhz: 1805-1880
          lte_fdd:
          - B1
          - B2
          - B3
          - B4
          - B5
          - B7
          - B8
          - B12
          - B13
          - B18
          - B19
          - B20
          - B25
          - B26
          - B28
          - B66
          lte_tdd:
          - B38
          - B39
          - B40
          - B41
        data_transfer_rates_kbps:
          lte_downlink: 10000
          lte_uplink: 5000
          edge_dl_ul: 236.8
          gprs_dl_ul: 85.6
        electrical_and_environmental:
          supply_voltage_v: 3.4 ~ 4.2
          temperature_range_c: -40 ~ +85
          sim_card_support_v: 1.8/3.0
          optional_functions:
          - Jamming Detection
          - TTS (Text To Speech)
          - Embedded AT
          firmware_management:
          - Firmware Upgrade (USB/FOTA)
      platform: ASR1603
    P1 & LoRa:
      manufacturer: STMicroelectronics
      model: STM32WLE5CCU6
      specifications:
        cpu: Arm Cortex-M4 up to 48 MHz
        radio: Sub-GHz LoRa
        radio_features:
          frequency_range_mhz: 150-960
          supported_modulations:
          - LoRa
          - (G)FSK
          - (G)MSK
          - BPSK
          rx_sensitivity_dbm:
            2fsk_1_2kbps: -123
            lora_sf12_bw_10_4khz: -148
          programmable_output_power_dbm:
            low_power_path: '+15'
            high_power_path: '+22'
        memory:
          flash: 256 KB
          sram: 64 KB
        operating_voltage_v: 1.8 to 3.6
        operating_temperature_c: -40 to +105; up to +85 with radio
        power_consumption_modes:
          shutdown_at_3v_na: 31
          standby_rtc_at_3v_na: 360
          stop2_rtc_at_3v_ua: 1.07
          rx_active_ma: 4.82
          tx_lora_125khz_10dbm_ma: 15
          tx_lora_125khz_20dbm_ma: 87
      datasheet: https://www.st.com/en/microcontrollers-microprocessors/stm32wle5cc.html
    gnss:
      manufacturer: Quectel
      model: LC79H (LC79HALMD)
      specifications:
        description: Multi-constellation GNSS module
        module_frequency_bands: L1/L5
        gnss_systems:
        - GPS
        - GLONASS
        - Galileo
        - BeiDou
        - QZSS
        module_constellations:
          GPS:
            bands:
              L1 C/A: 1575.42
              L5: 1176.45
          QZSS:
            bands:
              L1 C/A: 1575.42
              L5: 1176.45
          GLONASS:
            bands:
              L1: 1602 + n x 0.5625 (n=-7,...6)
          Galileo:
            bands:
              E1: 1575.42
              E5a: 1176.45
          BeiDou:
            bands:
              B1I: 1561.098
              B2a: 1176.45
        module_accuracy:
          autonomous_position_cep_m: 1.0
          conditions: 'Module reference conditions: 24-hour static test, -130 dBm, more than six satellites;
            not a finished-product accuracy specification.'
        tracking_channels: 135
        time_to_first_fix_without_agnss_s:
          cold: 26
          warm: 18
          hot: 1
        max_altitude_m: 10000
        max_velocity_ms: 500
        max_acceleration_g: 4
        nav_update_rate: 1 Hz (default)
        supply_voltage_v: 1.75 to 1.98 (typical 1.8)
        operating_temperature_c: -40 to +85
        current_consumption:
          acquisition_ma: 33
          tracking_ma: 33
          backup_ua: 20
          conditions: Default constellations, 1.8 V
        interfaces:
          i2c: Up to 400 kbps
          uart: 9600 to 921600 bps; default 115200 bps
        protocols:
        - NMEA 0183
        - RTCM 3.x
      datasheet: https://www.quectel.com/content/uploads/2024/03/Quectel_LC79HAL_GNSS_Specification_V1.3-3.pdf?wpId=114202
    P2 & Wi-Fi/Bluetooth:
      manufacturer: Espressif Systems
      model: ESP32-C6
      datasheet: https://www.espressif.com/sites/default/files/documentation/esp32-c6_datasheet_en.pdf
      specifications:
        soc_description: Ultra-low-power SoC with RISC-V single-core CPU, supports Wi-Fi 6 (802.11ax),
          Bluetooth LE, Zigbee, Thread
        wi_fi_protocols: 802.11 b/g/n/ax (2.4 GHz Wi-Fi 6)
        wi_fi_frequency_range_mhz: 2412 ~ 2484
        tx_power_dbm:
          802_11b: '+21'
          802_11ax (MCS9, 20MHz): '+19.5'
        radio_features:
          bluetooth_specification: 5.3 LE
          ieee_802_15_4_support: 'Yes'
        cpu:
          high_performance: 32-bit RISC-V up to 160 MHz
          low_power: 32-bit RISC-V up to 20 MHz
        memory:
          rom: 320 KB
          hp_sram: 512 KB
          lp_sram: 16 KB
          in_package_flash: 4 MB
        operating_voltage_v: 3.0 ~ 3.6
        crystal_frequency_range_mhz: '40'
        power_consumption_deep_sleep_ua: 7
        power_consumption_active_ma:
          typical_receive: ~71-82
          typical_transmit_max: ~354
    accelerometer:
      manufacturer: STMicroelectronics
      model: LIS3DHTR
      specifications:
        device_type: 'MEMS digital output motion sensor: ultra-low-power high-performance 3-axis ''nano''
          accelerometer'
        data_output: 16-bit
        full_scale_range: ±2g/±4g/±8g/±16g (dynamically selectable)
        supply_voltage_v: 1.71 to 3.6
        operating_temperature_c: -40 to +85
        power_consumption_ulp_ua: down to 2 (normal mode at 1 Hz ODR)
    temperature & humidity (optional):
      model: FHT40-DD-TR
      availability: Optional
      specifications:
        sensing_elements:
        - Temperature
        - Relative humidity
    pressure (optional):
      manufacturer: TDK InvenSense
      model: ICP-10111
      availability: Optional
      specifications:
        sensing_element: Barometric pressure
        pressure_range_hpa: 300 to 1100
      datasheet: https://invensense.tdk.com/wp-content/uploads/2021/06/DS-000177-ICP-10111-v1.3.pdf
    charger:
      manufacturer: Richtek
      model: RT9471
      datasheet: https://www.richtek.com/content/dam/richtek/data/en/resources/product-specifications/rt94/rt9471-rt9471d/product-data-sheets/pdf/DS9471D-04.pdf
      specifications:
        description: I2C-controlled 3A single-cell switching Li-ion/Li-polymer charger
        input_voltage_range_v: 3.9 to 13.5
        input_current_limit_a: 0.05 to 3.2 (programmable)
        maximum_input_current_at_12v_or_above_a: 2
        charge_current_a: 0 to 3.15 (50 mA steps)
        charge_voltage_range_v: 3.9 to 4.7
        charge_voltage_step_mv: 10
        charge_efficiency_percent: 92 at 2 A, 5 V input, 3.8 V battery
        usb_otg_output_v: 4.85 to 5.3 (150 mV steps; default 5.15)
        usb_otg_current_limit_a: 0.5 or 1.2
        boost_efficiency_percent: 92 at 1 A, 3.8 V battery, 5.15 V output
        battery_discharge_mosfet_resistance_mohm: 18
        maximum_battery_discharge_current_a: 6
        power_path_management: Automatic system power-path management with battery supplementation
        switching_frequency_mhz: 1.5
        operating_temperature_c: -40 to +85
        protection:
        - Input and battery over-voltage
        - Over-temperature and charge thermal regulation
        - Cycle-by-cycle over-current
        - Battery temperature qualification (JEITA)
        - Safety timer
        notes: Component capabilities; actual product operating limits and firmware configuration apply.
  battery:
    overall:
      capacity_mah: 6600
      pack_configuration: 1S2P
      voltage_v: 3.7
    cells:
      type: 18650
      spec:
        model: 18650 3300mAh
        type: Li-ion Cell
        nominal_voltage_v: 3.7
        nominal_capacity_mah: 3300
        nominal_energy_wh: 12.21
        physical_dimensions_mm: Φ 65.0*18.0
        appearance: Blue cylindrical battery
        certifications_and_tests:
          standard: UN38.3 (UNITED NATIONS 'Recommendations on the TRANSPORT OF DANGEROUS GOODS' Manual
            of Tests and Criteria ST/SG/AC.10/11/Rev.6, 38.3)
          tests:
            Altitude simulation: No leakage, no venting, no disassembly, no rupture & no fire
            Thermal test: No leakage, no venting, no disassembly, no rupture & no fire
            Vibration: No leakage, no venting, no disassembly, no rupture & no fire
            Shock: Included as a test item in the UN38.3 report
            External short circuit: 'No disassembly, no rupture & no fire (Max external temperature: 66.4
              ~ 78.8°C)'
            Impact: 'No disassembly & no fire (Max external temperature: 106.9 ~ 129.2°C)'
            Forced discharge: No disassembly & no fire
`,T=JSON.parse('{"title":"Pro","description":"","frontmatter":{"aside":true},"headers":[],"relativePath":"devices/pro/index.md","filePath":"devices/pro/index.md"}'),S={name:"devices/pro/index.md"},k=Object.assign(S,{setup(P){const i=f(w),d=["Front angle","Top side","Back","Side"],m=y(()=>{var l,e;return(((e=(l=i.value)==null?void 0:l.product)==null?void 0:e.images)??[]).map((p,s)=>({src:p,label:d[s]??`Image ${s+1}`,alt:`Shared Pro enclosure, ${(d[s]??`image ${s+1}`).toLowerCase()} view`,fit:"cover",scale:1.25,offsetY:s===3?-20.833333:0}))});return(l,e)=>{const p=c("DownloadSpecButton"),s=c("DeviceCapabilities"),_=c("DeviceImageGallery"),g=c("DeviceOverview"),h=c("DeviceSpecOverview"),r=c("DeviceSpecSection");return b(),v("div",{"data-pagefind-body":!0,"data-pagefind-meta":"date:1794418382000"},[e[2]||(e[2]=n("h1",{id:"pro",tabindex:"-1"},[t("Pro "),n("a",{class:"header-anchor",href:"#pro","aria-label":'Permalink to "Pro"'},"​")],-1)),a(g,{id:"pro-pr2"},{media:u(()=>[a(_,{id:"images",images:m.value,"aria-label":"Pro enclosure gallery",caption:"Shared exterior views for Pro3 and ProN/PR2."},null,8,["images"])]),default:u(()=>[e[0]||(e[0]=n("p",null,[t("The current Pro is Pro3 (PR3), a different hardware generation from "),n("a",{href:"/docs/pr/30/devices/history/PR2"},"ProN (PR2)"),t(". The two generations share the same external appearance, so use the product code and device ID to identify your device before following its instructions. ProN (PR2) is now a legacy model and is no longer in production.")],-1)),a(p,{spec:o(i),deviceTitle:"Pro (PR3)",label:"Download PR3 PDF"},null,8,["spec"]),e[1]||(e[1]=n("h2",{id:"capabilities",tabindex:"-1"},[t("Feature guides "),n("a",{class:"header-anchor",href:"#capabilities","aria-label":'Permalink to "Feature guides {#capabilities}"'},"​")],-1)),a(s,{device:"PR3"})]),_:1}),e[3]||(e[3]=n("h2",{id:"specifications",tabindex:"-1"},[t("Specifications "),n("a",{class:"header-anchor",href:"#specifications","aria-label":'Permalink to "Specifications"'},"​")],-1)),e[4]||(e[4]=n("p",null,"The overview, tables and PDF use the same Pro3 specification. Optional sensors and features requiring compatible firmware are labelled in the tables. Component specifications describe the individual parts, not additional finished-product guarantees.",-1)),e[5]||(e[5]=n("h3",{id:"overview",tabindex:"-1"},[t("Overview "),n("a",{class:"header-anchor",href:"#overview","aria-label":'Permalink to "Overview"'},"​")],-1)),a(h,{spec:o(i)},null,8,["spec"]),e[6]||(e[6]=n("h3",{id:"physical",tabindex:"-1"},[t("Physical "),n("a",{class:"header-anchor",href:"#physical","aria-label":'Permalink to "Physical"'},"​")],-1)),a(r,{spec:o(i),sectionName:"physical"},null,8,["spec"]),e[7]||(e[7]=n("h3",{id:"integrations",tabindex:"-1"},[t("Integrations "),n("a",{class:"header-anchor",href:"#integrations","aria-label":'Permalink to "Integrations"'},"​")],-1)),a(r,{spec:o(i),sectionName:"integrations"},null,8,["spec"]),e[8]||(e[8]=n("h3",{id:"user-interface",tabindex:"-1"},[t("User interface "),n("a",{class:"header-anchor",href:"#user-interface","aria-label":'Permalink to "User interface"'},"​")],-1)),a(r,{spec:o(i),sectionName:"user interface"},null,8,["spec"]),e[9]||(e[9]=n("h3",{id:"connectivity",tabindex:"-1"},[t("Connectivity "),n("a",{class:"header-anchor",href:"#connectivity","aria-label":'Permalink to "Connectivity"'},"​")],-1)),a(r,{spec:o(i),sectionName:"connectivity"},null,8,["spec"]),e[10]||(e[10]=n("h3",{id:"positioning",tabindex:"-1"},[t("Positioning "),n("a",{class:"header-anchor",href:"#positioning","aria-label":'Permalink to "Positioning"'},"​")],-1)),a(r,{spec:o(i),sectionName:"positioning"},null,8,["spec"]),e[11]||(e[11]=n("h3",{id:"sensors",tabindex:"-1"},[t("Sensors "),n("a",{class:"header-anchor",href:"#sensors","aria-label":'Permalink to "Sensors"'},"​")],-1)),a(r,{spec:o(i),sectionName:"sensors"},null,8,["spec"]),e[12]||(e[12]=n("h3",{id:"battery",tabindex:"-1"},[t("Battery "),n("a",{class:"header-anchor",href:"#battery","aria-label":'Permalink to "Battery"'},"​")],-1)),a(r,{spec:o(i),sectionName:"battery"},null,8,["spec"]),e[13]||(e[13]=n("h3",{id:"charging-specification",tabindex:"-1"},[t("Charging "),n("a",{class:"header-anchor",href:"#charging-specification","aria-label":'Permalink to "Charging {#charging-specification}"'},"​")],-1)),a(r,{spec:o(i),sectionName:"charging"},null,8,["spec"]),e[14]||(e[14]=n("h3",{id:"components",tabindex:"-1"},[t("Components "),n("a",{class:"header-anchor",href:"#components","aria-label":'Permalink to "Components"'},"​")],-1)),a(r,{spec:o(i),sectionName:"components"},null,8,["spec"])])}}});export{T as __pageData,k as default};
