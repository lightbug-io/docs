import{l as g}from"./chunks/loadSpec.CMtE0fd_.js";import{ad as u,z as r,J as s,K as a,y as o,x as d,u as n,A as p,N as i,F as l,ab as b}from"./chunks/framework.BnTFvF69.js";import"./chunks/theme.BIaC7wZU.js";const y=`product:
  name: "Enviro"
  description: "Our core tracking device with additional environmental sensors."
  usage: "For tracking temperature & humidity sensitive non powered assets"
  sku: EN2
  prefix: 26
  version: 2
  images:
  - "https://upload.r2.lb.chasm.cloud/2025/raw-renders/2025-07-01/enviro-front angle.png?x=600&y=300&w=600&h=700"
  - "https://upload.r2.lb.chasm.cloud/2025/raw-renders/2025-07-01/enviro-top side.png?x=600&y=200&w=600&h=700"
  - "https://upload.r2.lb.chasm.cloud/2025/raw-renders/2025-07-01/enviro-back.png?x=650&y=200&w=600&h=700"
  - "https://upload.r2.lb.chasm.cloud/2025/raw-renders/2025-07-01/enviro-side.png?x=700&y=370&w=600&h=700"
  physical:
    size:
      dimensions_mm: "85 x 44 x 28.4"
      weight_g: 152
    certifications:
      - "CE"
    rating:
      ik: Shockproof
      operating temperature_c: "-20 to +60"
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
      features:
        - "3-axis accelerometer"
        - Motion Detection
        - Orientation & Tilt detection
        - Shock and Vibration detection
      typical_accuracy_g: 0.01
    temperature:
      features:
        - "Temperature Sensing (high accuracy)"
        - "Thermal Protection"
      typical_accuracy_c: 0.5
    humidity:
      typical_accuracy_pct: 3
    pressure:
      typical_accuracy_hpa: 0.002
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
          egprs_dl: 85.6
          egprs_ul: 85.6
          edge_dl_ul: 236.8
          gprs_dl_ul: 85.6
        supply_voltage_range_v: "3.0 ~ 4.3"
        power_consumption_typical:
          power_off_ua: 7
          psm_ua: 9
          sleep_ma: 1
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
      model: "SIM7000G"
      specifications:
        gnss_systems:
          - GPS
          - BeiDou
          - GLONASS
        receiver_type:
          channels: 16-channel
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
    bme280:
      manufacturer: "Bosch Sensortec"
      model: "BME280"
      specifications:
        description: "Humidity sensor measuring relative humidity, barometric pressure and ambient temperature"
        operation_range_temperature_c: "-40 to 85"
        operation_range_pressure_hpa: "300 to 1100"
        humidity_accuracy_pct: "±3"
        pressure_accuracy_hpa: "0.002"
        supply_voltage_v_vddio: "1.2 to 3.6"
        supply_voltage_v_vdd: "1.71 to 3.6"
        interface: "I²C and SPI"
        average_current_consumption_ua_1hz_h_t: "1.8"
        average_current_consumption_ua_1hz_p_t: "2.8"
        average_current_consumption_ua_1hz_h_p_t: "3.6"
        average_current_consumption_sleep_mode_ua: "0.1"
        response_time_humidity_s: "1"
        hysteresis_humidity_pct: "<=2"
        rms_noise_pressure_hpa: "0.002"
        temperature_coefficient_offset_pressure_pak: "±1.5"
        package_dimensions_mm: "2.5 x 2.5 x 0.93"
    ms5637:
      manufacturer: "MEAS Switzerland"
      model: "MS5637-02BA03"
      specifications:
        description: "Ultra-compact micro altimeter for precise digital 24-bit pressure and temperature value, optimized for altimeter and barometer applications. Used for dew point calculation."
        package_dimensions_mm: "3 x 3 x 0.9"
        supply_voltage_v: "1.5 to 3.6"
        fast_conversion_speed_ms: "0.5"
        low_power_ua_standby: "0.1 (at 25°C)"
        typical_active_current_consumption_ua: "0.6"
        interface: "I2C"
        operating_range_pressure_mbar: "300 to 1200"
        operating_range_temperature_c: "-40 to +85"
        adc_resolution: "24 bit"
        pressure_resolution_mbar: "0.016 (at OSR 8192)"
        pressure_error_band_at_25c_mbar: "±2 (300 to 1200 mbar)"
        pressure_error_band_at_-20_to_85c_mbar: "±4 (300 to 1200 mbar)"
        long_term_stability_mbar_per_yr: "±1"
        temperature_accuracy_at_25c: "±1"
        temperature_resolution_c: "<0.01"
        max_soldering_temperature_c: "250 (40 sec max)"
        esd_rating_hbm_kv: "±2"
  battery:
    overall:
      capacity_mah: 6600
      pack_configuration: "1S2P"
      voltage_v: 3.7
    cells:
      type: 18650
      spec:
        model: "18650 3300mAh"
        type: "Li-ion Cell"
        nominal_voltage_v: 3.7
        nominal_capacity_mah: 3300
        nominal_energy_wh: 12.21
        physical_dimensions_mm: "65.0*18.0"
        appearance: "Blue cylindrical battery"
        certifications_and_tests:
          standard: "UN38.3 (UNITED NATIONS 'Recommendations on the TRANSPORT OF DANGEROUS GOODS' Manual of Tests and Criteria ST/SG/AC.10/11/Rev.6, 38.3)"
          tests:
            "Altitude simulation": "No leakage, no venting, no disassembly, no rupture & no fire"
            "Thermal test": "No leakage, no venting, no disassembly, no rupture & no fire"
            "Vibration": "No leakage, no venting, no disassembly, no rupture & no fire"
            "Shock": "Included as a test item in the UN38.3 report"
            "External short circuit": "No disassembly, no rupture & no fire (Max external temperature: 66.4 ~ 78.8°C)"
            "Impact": "No disassembly & no fire (Max external temperature: 106.9 ~ 129.2°C)"
            "Forced discharge": "No disassembly & no fire"
`,w=JSON.parse('{"title":"Enviro (EN2)","description":"","frontmatter":{"aside":true},"headers":[],"relativePath":"devices/enviro/index.md","filePath":"devices/enviro/index.md"}'),f={name:"devices/enviro/index.md"},C=Object.assign(f,{setup(v){const e=g(y);return(S,t)=>{const m=u("DownloadSpecButton"),h=u("DeviceSpecImages"),_=u("DeviceSpecOverview"),c=u("DeviceSpecSection");return r(),s("div",{"data-pagefind-body":!0,"data-pagefind-meta":"date:1793203908000"},[t[17]||(t[17]=a("h1",{id:"enviro-en2",tabindex:"-1"},[o("Enviro (EN2) "),a("a",{class:"header-anchor",href:"#enviro-en2","aria-label":'Permalink to "Enviro (EN2)"'},"​")],-1)),d(m,{spec:n(e),deviceTitle:"Enviro (EN2)"},null,8,["spec"]),t[18]||(t[18]=a("h2",{id:"images",tabindex:"-1"},[o("Images "),a("a",{class:"header-anchor",href:"#images","aria-label":'Permalink to "Images"'},"​")],-1)),d(h,{spec:n(e)},null,8,["spec"]),t[19]||(t[19]=a("h2",{id:"overview",tabindex:"-1"},[o("Overview "),a("a",{class:"header-anchor",href:"#overview","aria-label":'Permalink to "Overview"'},"​")],-1)),n(e)?(r(),p(_,{key:0,spec:n(e)},null,8,["spec"])):i("",!0),n(e)&&n(e).physical?(r(),s(l,{key:1},[t[0]||(t[0]=a("h2",{id:"physical",tabindex:"-1"},[o("Physical "),a("a",{class:"header-anchor",href:"#physical","aria-label":'Permalink to "Physical"'},"​")],-1)),n(e)?(r(),p(c,{key:0,spec:n(e),sectionName:"physical"},null,8,["spec"])):i("",!0)],64)):i("",!0),n(e)&&n(e).integrations?(r(),s(l,{key:2},[t[1]||(t[1]=a("h2",{id:"integrations",tabindex:"-1"},[o("Integrations "),a("a",{class:"header-anchor",href:"#integrations","aria-label":'Permalink to "Integrations"'},"​")],-1)),n(e)?(r(),p(c,{key:0,spec:n(e),sectionName:"integrations"},null,8,["spec"])):i("",!0)],64)):i("",!0),t[20]||(t[20]=a("h2",{id:"overview-1",tabindex:"-1"},[o("Overview "),a("a",{class:"header-anchor",href:"#overview-1","aria-label":'Permalink to "Overview"'},"​")],-1)),d(_,{spec:n(e)},null,8,["spec"]),n(e).product.physical?(r(),s(l,{key:3},[t[2]||(t[2]=a("h2",{id:"physical-1",tabindex:"-1"},[o("Physical "),a("a",{class:"header-anchor",href:"#physical-1","aria-label":'Permalink to "Physical"'},"​")],-1)),d(c,{spec:n(e),sectionName:"physical"},null,8,["spec"])],64)):i("",!0),n(e).product.integrations?(r(),s(l,{key:4},[t[3]||(t[3]=a("h2",{id:"integrations-1",tabindex:"-1"},[o("Integrations "),a("a",{class:"header-anchor",href:"#integrations-1","aria-label":'Permalink to "Integrations"'},"​")],-1)),d(c,{spec:n(e),sectionName:"integrations"},null,8,["spec"])],64)):i("",!0),n(e).product["user interface"]?(r(),s(l,{key:5},[t[4]||(t[4]=a("h2",{id:"user-interface",tabindex:"-1"},[o("User Interface "),a("a",{class:"header-anchor",href:"#user-interface","aria-label":'Permalink to "User Interface"'},"​")],-1)),d(c,{spec:n(e),sectionName:"user interface"},null,8,["spec"])],64)):i("",!0),n(e).product.connectivity?(r(),s(l,{key:6},[t[5]||(t[5]=a("h2",{id:"connectivity",tabindex:"-1"},[o("Connectivity "),a("a",{class:"header-anchor",href:"#connectivity","aria-label":'Permalink to "Connectivity"'},"​")],-1)),d(c,{spec:n(e),sectionName:"connectivity"},null,8,["spec"])],64)):i("",!0),n(e).product.positioning?(r(),s(l,{key:7},[t[6]||(t[6]=a("h2",{id:"positioning",tabindex:"-1"},[o("Positioning "),a("a",{class:"header-anchor",href:"#positioning","aria-label":'Permalink to "Positioning"'},"​")],-1)),d(c,{spec:n(e),sectionName:"positioning"},null,8,["spec"])],64)):i("",!0),n(e).product.sensors?(r(),s(l,{key:8},[t[7]||(t[7]=a("h2",{id:"sensors",tabindex:"-1"},[o("Sensors "),a("a",{class:"header-anchor",href:"#sensors","aria-label":'Permalink to "Sensors"'},"​")],-1)),d(c,{spec:n(e),sectionName:"sensors"},null,8,["spec"])],64)):i("",!0),n(e).product.battery?(r(),s(l,{key:9},[t[8]||(t[8]=a("h2",{id:"battery",tabindex:"-1"},[o("Battery "),a("a",{class:"header-anchor",href:"#battery","aria-label":'Permalink to "Battery"'},"​")],-1)),d(c,{spec:n(e),sectionName:"battery"},null,8,["spec"])],64)):i("",!0),n(e).product.charging?(r(),s(l,{key:10},[t[9]||(t[9]=a("h2",{id:"charging",tabindex:"-1"},[o("Charging "),a("a",{class:"header-anchor",href:"#charging","aria-label":'Permalink to "Charging"'},"​")],-1)),d(c,{spec:n(e),sectionName:"charging"},null,8,["spec"])],64)):i("",!0),n(e).product.components?(r(),s(l,{key:11},[t[10]||(t[10]=a("h2",{id:"components",tabindex:"-1"},[o("Components "),a("a",{class:"header-anchor",href:"#components","aria-label":'Permalink to "Components"'},"​")],-1)),d(c,{spec:n(e),sectionName:"components"},null,8,["spec"])],64)):i("",!0),n(e)&&n(e).connectivity?(r(),s(l,{key:12},[t[11]||(t[11]=a("h2",{id:"connectivity-1",tabindex:"-1"},[o("Connectivity "),a("a",{class:"header-anchor",href:"#connectivity-1","aria-label":'Permalink to "Connectivity"'},"​")],-1)),n(e)?(r(),p(c,{key:0,spec:n(e),sectionName:"connectivity"},null,8,["spec"])):i("",!0)],64)):i("",!0),n(e)&&n(e).positioning?(r(),s(l,{key:13},[t[12]||(t[12]=a("h2",{id:"positioning-1",tabindex:"-1"},[o("Positioning "),a("a",{class:"header-anchor",href:"#positioning-1","aria-label":'Permalink to "Positioning"'},"​")],-1)),n(e)?(r(),p(c,{key:0,spec:n(e),sectionName:"positioning"},null,8,["spec"])):i("",!0)],64)):i("",!0),n(e)&&n(e).sensors?(r(),s(l,{key:14},[t[13]||(t[13]=a("h2",{id:"sensors-1",tabindex:"-1"},[o("Sensors "),a("a",{class:"header-anchor",href:"#sensors-1","aria-label":'Permalink to "Sensors"'},"​")],-1)),n(e)?(r(),p(c,{key:0,spec:n(e),sectionName:"sensors"},null,8,["spec"])):i("",!0)],64)):i("",!0),n(e)&&n(e).battery?(r(),s(l,{key:15},[t[14]||(t[14]=a("h2",{id:"battery-1",tabindex:"-1"},[o("Battery "),a("a",{class:"header-anchor",href:"#battery-1","aria-label":'Permalink to "Battery"'},"​")],-1)),n(e)?(r(),p(c,{key:0,spec:n(e),sectionName:"battery"},null,8,["spec"])):i("",!0)],64)):i("",!0),n(e)&&n(e).charging?(r(),s(l,{key:16},[t[15]||(t[15]=a("h2",{id:"charging-1",tabindex:"-1"},[o("Charging "),a("a",{class:"header-anchor",href:"#charging-1","aria-label":'Permalink to "Charging"'},"​")],-1)),n(e)?(r(),p(c,{key:0,spec:n(e),sectionName:"charging"},null,8,["spec"])):i("",!0)],64)):i("",!0),n(e)&&n(e).components?(r(),s(l,{key:17},[t[16]||(t[16]=a("h2",{id:"components-1",tabindex:"-1"},[o("Components "),a("a",{class:"header-anchor",href:"#components-1","aria-label":'Permalink to "Components"'},"​")],-1)),n(e)?(r(),p(c,{key:0,spec:n(e),sectionName:"components"},null,8,["spec"])):i("",!0)],64)):i("",!0),t[21]||(t[21]=b("",8))])}}});export{w as __pageData,C as default};
