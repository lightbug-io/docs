import{v as k,ar as p,z as t,J as r,A as h,u as E,K as i,y as s,C as d,c as g,ag as y}from"./chunks/framework.CiennuRd.js";import{_ as c,A as o}from"./chunks/ApiReference.vue_vue_type_script_setup_true_lang.BeJmX0EX.js";import{l as u}from"./chunks/load.B2aKF3la.js";import"./chunks/theme.c0TVZonh.js";const B=JSON.parse('{"title":"","description":"","frontmatter":{"aside":false,"outline":false,"pageClass":"api-reference-page"},"headers":[],"params":{"operationId":"get-users-id-getDevicesByTag","pageTitle":"Version 1: Devices with tag"},"relativePath":"apis/v1/get-users-id-getDevicesByTag.md","filePath":"apis/v1/[operationId].md"}'),F={name:"apis/v1/get-users-id-getDevicesByTag.md"},I=k({...F,setup(m){const l=u(1,y),n=p(),e=g(()=>n.data.params.operationId);return(A,a)=>(t(),r("div",{"data-pagefind-body":!0,"data-pagefind-meta":"date:NaN"},[(t(),h(c,{key:e.value,"operation-id":e.value,spec:E(l)},null,8,["operation-id","spec"])),a[1]||(a[1]=i("h2",{id:"openapi-definition",tabindex:"-1"},[s("OpenAPI definition "),i("a",{class:"header-anchor",href:"#openapi-definition","aria-label":'Permalink to "OpenAPI definition"'},"​")],-1)),(t(),h(o,{version:1,key:e.value},{default:d(()=>[...a[0]||(a[0]=[i("div",{class:"api-yaml-document","data-yaml":`openapi: 3.1.0
info:
  version: 1.1.0
  title: TrackingAPI
  description: V1 API for retrieving tracking data and changing settings on Lightbug devices
servers:
  - url: https://api.lightbug.cloud/api
externalDocs: {}
security:
  - ApiKeyAuth: []
tags:
  - name: device
paths:
  /users/{id}/getDevicesByTag:
    get:
      tags:
        - device
      summary: Devices with tag
      parameters:
        - name: id
          in: path
          description: user id
          required: true
          schema:
            type: string
            format: JSON
        - name: tag
          in: query
          description: Tag to search for in fully qualified key:value format. Example device_type:truck. Partial searches with wildcards may be used, eg device_type:% or device_type:veh_%
          required: true
          schema:
            type: string
        - name: fields
          in: query
          description: Optional array of device model fields to return. eg ["id","name"]
          required: false
          schema:
            type: string
            format: JSON
      responses:
        '200':
          description: Request was successful
          content:
            application/json:
              schema:
                description: Returns Array of device objects
                type: array
                items:
                  properties: {}
                  type: object
      deprecated: false
      security:
        - ApiKeyAuth: []
      operationId: get-users-id-getDevicesByTag
components:
  securitySchemes:
    ApiKeyAuth:
      in: header
      name: Authorization
      type: apiKey
      description: API Key for authentication. Retrieval from either API version login routes, or other authentication token type. See <a href='/apis/authentication'>Authentication</a> for more details.
      example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
`},[i("div",{class:"api-yaml-chunk"},[i("div",{class:"language-yaml vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"yaml"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0","v-pre":""},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"openapi"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"3.1.0")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"info"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"  version"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"1.1.0")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"  title"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"TrackingAPI")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"  description"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"V1 API for retrieving tracking data and changing settings on Lightbug devices")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"servers"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"  - "),i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"url"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"https://api.lightbug.cloud/api")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"externalDocs"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": {}")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"security"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"  - "),i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"ApiKeyAuth"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": []")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"tags"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"  - "),i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"name"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"device")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"paths"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"  /users/{id}/getDevicesByTag"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"    get"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"      tags"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"        - "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"device")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"      summary"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"Devices with tag")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"      parameters"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"        - "),i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"name"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"id")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          in"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"path")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          description"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"user id")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          required"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"true")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          schema"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"            type"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"string")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"            format"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"JSON")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"        - "),i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"name"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"tag")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          in"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"query")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          description"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"Tag to search for in fully qualified key:value format. Example device_type:truck. Partial searches with wildcards may be used, eg device_type:% or device_type:veh_%")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          required"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"true")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          schema"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"            type"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"string")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"        - "),i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"name"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"fields")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          in"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"query")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          description"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'Optional array of device model fields to return. eg ["id","name"]')]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          required"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"false")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          schema"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"            type"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"string")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"            format"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"JSON")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"      responses"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")])])])])]),i("details",{class:"api-yaml-fold",open:""},[i("summary",{style:{"--api-yaml-indent":"8ch"}},[i("code",{class:"api-yaml-source","v-pre":""},"'200':")]),i("div",{class:"api-yaml-chunk"},[i("div",{class:"language-yaml vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"yaml"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0","v-pre":""},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          description"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"Request was successful")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          content"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"            application/json"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"              schema"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                description"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"Returns Array of device objects")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                type"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"array")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                items"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                  properties"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": {}")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                  type"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"object")])])])])])]),i("div",{class:"api-yaml-chunk"},[i("div",{class:"language-yaml vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"yaml"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0","v-pre":""},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"      deprecated"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"false")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"      security"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"        - "),i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"ApiKeyAuth"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": []")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"      operationId"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"get-users-id-getDevicesByTag")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"components"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"  securitySchemes"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"    ApiKeyAuth"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"      in"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"header")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"      name"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"Authorization")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"      type"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"apiKey")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"      description"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"API Key for authentication. Retrieval from either API version login routes, or other authentication token type. See <a href='/apis/authentication'>Authentication</a> for more details.")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"      example"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")])])])])])],-1)])]),_:1}))]))}});export{B as __pageData,I as default};
