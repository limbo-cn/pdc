<template>
  <q-dialog :value="showDialog" @hide="hideDialog" @show="showPDF" full-height>
    <q-layout view="hHh lpR fFf" container class="bg-white" style="width: 800px; max-width: 90vw;">
      <q-header :style="{background:$q.dark.isActive?'#445a4d':'#3aaa35'}">
        <q-toolbar class="glossy">
          <q-toolbar-title>{{$t('exportPdf')}}</q-toolbar-title>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-toolbar>
      </q-header>

      <q-page-container style="min-width:800px">
        <q-page class="text-black" id="pdf-card">
          <div id="pdf-card-projector">
            <div class="q-pa-sm row items-start q-gutter-sm">
              <div class="text-h6">{{$t('pdfTitle')}}
                <img src="../assets/Vivitek Logo.png" class="rounded-borders absolute-top-right" style="height: 30px;padding: 2px; margin:24px;">
              </div>
            </div>
            <div class="q-pl-md row items-start q-gutter-sm">
              <div class="text-body1">{{$t('projectorAndLens')}}</div>
            </div>
            <div class="q-pa-sm row items-start q-gutter-sm">
              <div class="col-2" style="margin:auto 20px">
                <q-img id="projectorImage" :src="projectorImage" :img-style="{'background-size':'contain'}" style="height:100px;width:120px" />
              </div>
              <div class="col" style="margin:auto">
                <div class="text-overline">{{selectedProjectorTypeName}}</div>
                <div class="text-h5">{{selectedProjector.ModelName}}</div>
                <div class="text-caption" id="projectorDetails">
                  <span v-if="selectedProjector.Resolution"> {{ `${$t('resolution')}: ${selectedProjector.Resolution.Desc}(${selectedProjector.Resolution.width}*${selectedProjector.Resolution.height})` }}<br /></span>
                  <span v-if="selectedProjector.Brightness"> {{ `${$t('brightness')}: ${selectedProjector.Brightness.value} ${selectedProjector.Brightness.unit}` }}<br /></span>
                  <span v-if="selectedProjector['Contrast Ratio']"> {{ `${$t('contrastRatio')}: ${selectedProjector['Contrast Ratio']}` }}<br /></span>
                  <span v-if="selectedProjector.Weight">{{ `${$t('weight')}: ${selectedProjector.Weight.value} ${selectedProjector.Weight.unit}` }}<br /></span>
                </div>
              </div>
              <div class="col-2" style="margin:auto 20px">
                <q-img id="lensImage" v-if="selectedLens" :src="lensImage" :img-style="{'background-size':'contain'}" style="height:120px;width:150px" />
                <q-img id="lensImage" v-else style="width:100px;margin:auto 20px;background-color:black" class="rounded-borders" :src="svgSrc" />
              </div>
              <div class="col" v-if="selectedLens" style="margin:auto">
                <div class="text-h5">{{selectedLens['Part Name']}}</div>
                <div class="text-caption" id="lensDetails">
                  <span v-if="selectedLens['Throw Ratio']">{{ `${$t('throwRatio')}: ${selectedLens['Throw Ratio'].min}-${selectedLens['Throw Ratio'].max}` }}</span><br />
                  <span v-if="selectedLens.Distance">{{ `${$t('distance')}: ${selectedLens.Distance.min}-${selectedLens.Distance.max} ${$t('m')}` }}</span><br />
                  <span v-if="selectedLens.Offset !== null">{{ `${$t('offset')}: ${selectedLens.Offset} %` }}<br /></span>
                </div>
              </div>
              <div class="col" v-else style="margin:auto">
                <div class="text-h5 q-mt-sm q-mb-xs">{{$t('fixed')}}</div>
                <div class="text-caption" id="lensDetails">
                  <span v-if="selectedProjector['Throw Ratio']">{{ `${$t('throwRatio')}: ${selectedProjector['Throw Ratio'].min}-${selectedProjector['Throw Ratio'].max}` }}<br /></span>
                  <span v-if="selectedProjector.Distance">{{ `${$t('distance')}: ${selectedProjector.Distance.min}-${selectedProjector.Distance.max} mm` }}<br /></span>
                  <span v-if="selectedProjector.Offset">{{ `${$t('offset')}: ${selectedProjector.Offset} %` }}<br /></span>
                </div>
              </div>
            </div>
          </div>

          <div id="pdf-card-views">
            <div class="q-pt-md q-pl-md q-pb-xs row items-start q-gutter-sm">
              <div class="text-body1">{{$t('simViews')}}
              </div>
            </div>
            <div class="q-pb-sm q-pl-md row items-start q-gutter-xs">
              <div class="col-12">
                <div class="text-weight-bold"> {{$t('sideView')}}</div>
                <q-img class="rounded-borders view-image" :class="{light:!$q.dark.isActive}" id="sideView-image" :src="sideViewImage" />
              </div>
              <div class="col-12">
                <div class="text-weight-bold"> {{$t('frontView')}}</div>
                <q-img class="rounded-borders view-image" :class="{light:!$q.dark.isActive}" id="frontView-image" :src="frontViewImage" />
              </div>
            </div>
            <div class="q-pb-sm q-pl-md row items-start q-gutter-xs">
              <div class="col-12">
                <div class="text-weight-bold"> {{$t('topView')}}</div>
                <q-img class="rounded-borders view-image" :class="{light:!$q.dark.isActive}" id="topView-image" :src="topViewImage" />
              </div>
              <div class="col-12">
                <div class="text-weight-bold"> {{$t('threeView')}}</div>
                <q-img class="rounded-borders view-image" :class="{light:!$q.dark.isActive}" id="threeView-image" :src="threeViewImage" />
              </div>
            </div>
          </div>

          <div id="pdf-card-result">

            <div class="q-pl-md q-pt-sm row items-start q-gutter-sm">
              <div class="text-body1">{{$t('simResult')}}
              </div>
            </div>
            <div class="row items-start q-gutter-sm">
              <div class="col-3">
                <div class="q-pl-lg row items-start q-gutter-sm">
                  <div class="text-weight-bold"> {{$t('roomSize')}}</div>
                </div>
                <div class="q-pl-lg row items-start q-gutter-sm">
                  <ul id="roomSize">
                    <li> {{$t('width')}} : {{roomWidth}} ({{unitLabel}})</li>
                    <li> {{$t('height')}} : {{roomHeight}} ({{unitLabel}})</li>
                    <li> {{$t('depth')}} : {{roomDepth}} ({{unitLabel}})</li>
                  </ul>
                </div>
                <div class="q-pl-lg row items-start q-gutter-sm">
                  <div class="text-weight-bold"> {{$t('installation')}}</div>
                </div>
                <div class="q-pl-lg row items-start q-gutter-sm">
                  <ul id="installation">
                    <li>{{installation}}</li>
                  </ul>
                </div>
                <div class="q-pl-lg row items-start q-gutter-sm">
                  <div class="text-weight-bold"> {{$t('screenSize')}}</div>
                </div>
                <div class="q-pl-lg row items-start q-gutter-sm">
                  <ul id="screenSize">
                    <li> {{$t('width')}} : {{screenWidth}} ({{unitLabel}})</li>
                    <li> {{$t('height')}} : {{screenHeight}} ({{unitLabel}})</li>
                    <li> {{$t('diagonal')}} : {{screenDiagonal}} ({{unitLabel}})</li>
                    <li> {{$t('aspectRatio')}} : {{aspectRatio}}</li>
                  </ul>
                </div>
              </div>
              <div class="col-3">
                <div class="q-pl-xs row items-start q-gutter-sm">
                  <div class="text-weight-bold"> {{$t('screenPosition')}}</div>
                </div>
                <div class="q-pl-xs row items-start q-gutter-sm">
                  <ul id="screenPosition">
                    <li> {{$t('fromLeft')}} : {{screenFromLeft}} ({{unitLabel}})</li>
                    <li> {{$t('fromFloor')}} : {{screenFromFloor}} ({{unitLabel}})</li>
                    <li> {{$t('screenOffset')}} : {{screenOffset}} ({{unitLabel}})</li>
                  </ul>
                </div>
                <div class="q-pl-xs row items-start q-gutter-sm">
                  <div class="text-weight-bold"> {{$t('projectorPosition')}}</div>
                </div>
                <div class="q-pl-xs row items-start q-gutter-sm">
                  <ul id="projectorPosition">
                    <li> {{$t('fromLeft')}} : {{fromLeftSide}} ({{unitLabel}})</li>
                    <li> {{$t('fromFloor')}} : {{fromFloor}} ({{unitLabel}})</li>
                    <li> {{$t('fromScreen')}} : {{fromScreen}} ({{unitLabel}})</li>
                    <li> {{$t('adjustRange')}} : {{`${fromScreen}-${maxDistance}`}} ({{unitLabel}})</li>
                    <li> {{$t('horizontalAngle')}} : {{angleH}} (°)</li>
                    <li> {{$t('verticalAngle')}} : {{angleV}} (°)</li>
                    <li> {{$t('lensShiftH')}} : {{lensShiftH}} (%)</li>
                    <li> {{$t('lensShiftV')}} : {{lensShiftV}} (%)</li>
                  </ul>
                </div>
              </div>
              <div class="col-3">
                <div class="q-pl-xs row items-start q-gutter-sm">
                  <div class="text-weight-bold"> {{$t('ambientLightSettings')}}</div>
                </div>
                <div class="q-pl-xs row items-start q-gutter-sm">
                  <ul id="ambientLightSettings">
                    <li> {{$t('roomBrightness')}} (lx): {{roomBrightness}}</li>
                    <li> {{$t('screenGain')}} : {{screenGain}}</li>
                    <li> {{$t('brightnessOnScreen')}} (nit): {{toFixedNumber(brightnessOnScreenNit,3)}}</li>
                    <li> {{$t('brightnessOnScreen')}} (lx): {{toFixedNumber(brightnessOnScreenLx,3)}}</li>
                    <li> {{$t('actualContrast')}}: {{toFixedNumber(actualContrast,2)}}:1</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="q-pa-md row items-start q-gutter-sm">
              <div class="text-body1">{{$t('disclaimer')}}
              </div>
            </div>
            <div class="q-pl-lg row items-start q-gutter-sm">
              <ul id="disclaimer">
                <li> {{$t('disclaimer1')}} </li>
                <li> {{$t('disclaimer2')}} </li>
                <li> {{$t('disclaimer3')}} </li>
                <li> {{$t('disclaimer4')}} </li>
              </ul>
            </div>
          </div>
        </q-page>
      </q-page-container>

      <q-footer :style="{background:$q.dark.isActive?'#445a4d':'#3aaa35'}">
        <q-toolbar>
          <q-input filled dense :color="$q.dark.isActive?'primary':'white'" dark v-model="pdfName" suffix=".pdf/.png"> </q-input>
          <q-space />
          <q-btn flat :color="$q.dark.isActive?'primary':'white'" :label="$t('exportPdf')" :loading="downloadingPDF" @click="exportPDF" />
          <q-btn flat :color="$q.dark.isActive?'primary':'white'" :label="$t('saveAsImage')" :loading="savingImage" @click="saveAsImage" />
        </q-toolbar>
      </q-footer>

    </q-layout>
  </q-dialog>
</template>

<script>
import JsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import logo from '../assets/vivitek Logo.json'
import { toFixedNumber, downloadFile } from 'src/helper/common'
import { installationType } from 'src/helper/enum'

let pdf = null

export default {
  name: 'Export-PDF',
  props: ['showDialog'],
  data() {
    return {
      aspectRatios: [
        { label: '4/3', value: 4 / 3 },
        { label: '16/9', value: 16 / 9 },
        { label: '16/10', value: 16 / 10 }
      ],
      toFixedNumber: toFixedNumber,
      downloadingPDF: false,
      savingImage: false,
      projectorImage: null,
      lensImage: null,
      svgSrc: require('../assets/Lens/Lens shutter.svg'),
      pdfName: ''
    }
  },
  computed: {
    selectedProjectorTypeName() {
      let tpyeName = ''
      this.$store.state.dataSource.projectorType.vvkProjectorTypes.forEach(o => {
        if (o.Models.includes(this.$store.state.dataSource.selectedModelName)) {
          tpyeName = o.Type
        }
      })
      return tpyeName
    },
    selectedProjector() {
      return this.$store.getters['dataSource/selectedProjector'] || {}
    },
    selectedLens() {
      return this.$store.getters['dataSource/selectedLens']
    },
    unitLabel() {
      return this.$store.state.common.unitLabel
    },
    roomWidth() {
      return toFixedNumber(this.$store.state.room.width * this.$store.state.common.unitRatio, 3)
    },
    roomHeight() {
      return toFixedNumber(this.$store.state.room.height * this.$store.state.common.unitRatio, 3)
    },
    roomDepth() {
      return toFixedNumber(this.$store.state.room.depth * this.$store.state.common.unitRatio, 3)
    },
    installation() {
      return this.$store.state.common.installation === installationType.desktop ? this.$t('desktop') : this.$t('ceiling')
    },
    screenWidth() {
      return toFixedNumber(this.$store.state.screen.width * this.$store.state.common.unitRatio, 3)
    },
    screenHeight() {
      return toFixedNumber(this.$store.state.screen.height * this.$store.state.common.unitRatio, 3)
    },
    screenDiagonal() {
      return toFixedNumber(this.$store.state.screen.diagonal * this.$store.state.common.unitRatio, 3)
    },
    aspectRatio() {
      return this.aspectRatios.find(o => o.value === this.$store.state.screen.aspectRatio).label
    },
    screenFromLeft() {
      return toFixedNumber(this.$store.state.screen.fromLeft * this.$store.state.common.unitRatio, 3)
    },
    screenFromFloor() {
      return toFixedNumber(this.$store.state.screen.fromFloor * this.$store.state.common.unitRatio, 3)
    },
    screenOffset() {
      return toFixedNumber(this.$store.state.screen.screenOffset * this.$store.state.common.unitRatio, 3)
    },
    fromLeftSide() {
      return toFixedNumber(this.$store.state.projector.fromLeftside * this.$store.state.common.unitRatio, 3)
    },
    fromFloor() {
      return toFixedNumber(this.$store.state.projector.fromFloor * this.$store.state.common.unitRatio, 3)
    },
    fromScreen() {
      return toFixedNumber((this.$store.state.projector.fromScreen - this.$store.state.screen.screenOffset) * this.$store.state.common.unitRatio, 3)
    },
    maxDistance() {
      return toFixedNumber(this.screenWidth * this.$store.state.projector.throwRatioMax, 3)
    },
    angleH() {
      return this.$store.state.projector.angleH
    },
    angleV() {
      return this.$store.state.projector.angleV
    },
    lensShiftH() {
      return toFixedNumber(this.$store.state.lens.lensShiftH, 3)
    },
    lensShiftV() {
      return toFixedNumber(this.$store.state.lens.lensShiftV, 3)
    },
    roomBrightness() {
      return this.$store.state.ambient.roomBrightness
    },
    screenGain() {
      return this.$store.state.ambient.screenGain
    },
    currentLuminous() {
      const selectedProjector = this.$store.state.dataSource.projectorModels.vvkProjectorModels.find(o => o.ModelName === this.$store.state.dataSource.selectedModelName)
      if (selectedProjector) {
        return selectedProjector.Brightness.value
      } else {
        return 0
      }
    },
    currentScreenAreaSize() {
      return this.$store.state.screen.width * this.$store.state.screen.height
    },
    brightnessOnScreenLx() {
      return this.currentLuminous / this.currentScreenAreaSize
    },
    brightnessOnScreenNit() {
      return this.brightnessOnScreenLx * this.screenGain / Math.PI
    },
    actualContrast() {
      return (this.brightnessOnScreenLx + this.roomBrightness) / this.roomBrightness
    },
    sideViewImage() {
      return this.$store.state.pdf.sideViewImage
    },
    frontViewImage() {
      return this.$store.state.pdf.frontViewImage
    },
    topViewImage() {
      return this.$store.state.pdf.topViewImage
    },
    threeViewImage() {
      return this.$store.state.pdf.threeViewImage
    }
  },
  watch: {
    selectedProjector: {
      handler: 'getProjectorImage',
      immediate: true
    },
    selectedLens: {
      handler: 'getLensImage',
      immediate: true
    }
  },
  methods: {
    hideDialog() {
      this.$emit('update:showDialog', false)
    },
    showPDF() {
      this.$root.$emit('generatePDF')
      this.pdfName = this.$t('pdfTitle')
    },
    getProjectorImage() {
      if (!this.selectedProjector) {
        return
      }
      this.projectorImage = require(`../assets/${this.selectedProjector.Picture}`)
    },
    getLensImage() {
      if (!this.selectedLens) {
        return
      }
      this.lensImage = require(`../assets/${this.selectedLens.Picture}`)
    },
    async exportPDF() {
      pdf = new JsPDF()
      this.downloadingPDF = true

      if (this.$i18n.locale === 'en-us') {
        this.generateTitle()
        await this.generateProjector()
        await this.generateViews()
        this.generateResult()
        this.generateDisclaimer()
      } else {
        const canvasP = await html2canvas(document.querySelector('#pdf-card-projector'))
        pdf.addImage(canvasP.toDataURL('image/png', 1), 'PNG', 5, 5, 200, 80)
        const canvasR = await html2canvas(document.querySelector('#pdf-card-result'))
        pdf.addImage(canvasR.toDataURL('image/png', 1), 'PNG', 5, 120, 200, 140)
        pdf.addPage()
        const canvasV = await html2canvas(document.querySelector('#pdf-card-views'))
        pdf.addImage(canvasV.toDataURL('image/png', 1), 'PNG', 5, 0, 200, 300)
      }

      pdf.save(`${this.pdfName}.pdf`)

      this.downloadingPDF = false
    },
    async saveAsImage() {
      this.savingImage = true
      const dom = document.querySelector('#pdf-card')
      const canvas = await html2canvas(dom)
      const dataURI = canvas.toDataURL('image/png', 1)
      downloadFile(`${this.pdfName}.png`, dataURI)
      this.savingImage = false
    },

    generateTitle() {
      pdf.addImage(logo.base64, 'PNG', 180, 5, 20, 8)
      pdf.setFontSize(12)
      pdf.text(10, 10, this.$t('pdfTitle'))
    },
    async generateProjector() {
      pdf.setFontSize(10)
      pdf.text(12, 16, this.$t('projectorAndLens'))

      let img = document.querySelector('#projectorImage')
      let imgCanvas = await html2canvas(img)
      pdf.addImage(imgCanvas.toDataURL('image/png', 1), 'PNG', 10, 25, 30, 18)
      pdf.setFontSize(10)
      pdf.text(45, 22, this.selectedProjectorTypeName)
      pdf.setFontSize(10)
      pdf.text(47, 27, this.selectedProjector.ModelName)
      pdf.setFontSize(8)
      document.querySelectorAll('#projectorDetails span').forEach((span, index) => {
        pdf.text(47, 31 + index * 4, span.innerText)
      })

      img = document.querySelector('#lensImage')
      imgCanvas = await html2canvas(img)
      pdf.addImage(imgCanvas.toDataURL('image/png', 1), 'PNG', 100, 25, this.selectedLens ? 30 : 20, this.selectedLens ? 18 : 20)
      pdf.setFontSize(10)
      pdf.text(135, 22, this.selectedLens ? this.selectedLens['Part Name'] : this.$t('fixed'))
      pdf.setFontSize(8)
      document.querySelectorAll('#lensDetails span').forEach((span, index) => {
        pdf.text(135, 27 + index * 4, span.innerText)
      })
    },
    generateResult() {
      pdf.setFontSize(10)
      pdf.text(12, 175, this.$t('simResult'))

      pdf.setFontSize(9)
      pdf.text(15, 180, this.$t('roomSize'))
      pdf.setFontSize(8)
      document.querySelectorAll('#roomSize li').forEach((li, index) => {
        pdf.text(16, 184 + index * 4, li.innerText)
      })

      pdf.setFontSize(9)
      pdf.text(15, 200, this.$t('installation'))
      pdf.setFontSize(8)
      document.querySelectorAll('#installation li').forEach((li, index) => {
        pdf.text(16, 204 + index * 4, li.innerText)
      })

      pdf.setFontSize(9)
      pdf.text(40, 180, this.$t('screenSize'))
      pdf.setFontSize(8)
      document.querySelectorAll('#screenSize li').forEach((li, index) => {
        pdf.text(41, 184 + index * 4, li.innerText)
      })

      pdf.setFontSize(9)
      pdf.text(75, 180, this.$t('screenPosition'))
      pdf.setFontSize(8)
      document.querySelectorAll('#screenPosition li').forEach((li, index) => {
        pdf.text(76, 184 + index * 4, li.innerText)
      })

      pdf.setFontSize(9)
      pdf.text(115, 180, this.$t('projectorPosition'))
      pdf.setFontSize(8)
      document.querySelectorAll('#projectorPosition li').forEach((li, index) => {
        pdf.text(116, 184 + index * 4, li.innerText)
      })

      pdf.setFontSize(9)
      pdf.text(155, 180, this.$t('ambientLightSettings'))
      pdf.setFontSize(8)
      document.querySelectorAll('#ambientLightSettings li').forEach((li, index) => {
        pdf.text(156, 184 + index * 4, li.innerText)
      })
    },
    async generateViews() {
      pdf.setFontSize(10)
      pdf.text(12, 55, this.$t('simViews'))

      pdf.setFontSize(8)
      pdf.text(5, 60, this.$t('sideView'))
      let img = document.querySelector('#sideView-image')
      let imgCanvas = await html2canvas(img)
      pdf.addImage(imgCanvas.toDataURL('image/png', 1), 'PNG', 5, 62, 100, 50)

      pdf.text(108, 60, this.$t('frontView'))
      img = document.querySelector('#frontView-image')
      img.width = 800
      img.height = 600
      imgCanvas = await html2canvas(img)
      pdf.addImage(imgCanvas.toDataURL(), 'JEPG', 108, 62, 100, 50)

      pdf.text(5, 115, this.$t('topView'))
      img = document.querySelector('#topView-image')
      imgCanvas = await html2canvas(img)
      pdf.addImage(imgCanvas.toDataURL(), 'JEPG', 5, 117, 100, 50)

      pdf.text(108, 115, this.$t('threeView'))
      img = document.querySelector('#threeView-image')
      imgCanvas = await html2canvas(img)
      pdf.addImage(imgCanvas.toDataURL(), 'JEPG', 108, 117, 100, 50)
    },
    generateDisclaimer() {
      pdf.setFontSize(10)
      pdf.text(12, 225, this.$t('disclaimer'))

      pdf.setFontSize(9)
      document.querySelectorAll('#disclaimer li').forEach((li, index) => {
        pdf.text(12, 230 + index * 5, `${index + 1}. ${li.innerText}`)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.view-image{
  background-color: #0b0c0e;
  width: 100%;
}
.light{
  background-color: white;
}
ul{
  list-style-type: none;
  padding-left: 5px;
}
</style>
