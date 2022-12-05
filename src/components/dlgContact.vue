<template>
    <q-dialog :value="showDialog" @show="show" @hide="hideDialog" transition-show="scale" transition-hide="scale">
        <q-card class="bg-positive text-white" style="min-width: 650px">
            <q-card-section>
                <div class="text-h6">Please fill in the required form to let us provide more support before exporting
                    the report.</div>
            </q-card-section>

            <q-card-section class="q-pt-none bg-white">
                <q-form class="row" ref="contactForm">
                    <div class="col-6 q-pl-sm q-pr-sm q-pt-md">
                        <q-input color="positive" dense v-model="formData.firstName" label="* First Name"
                            :rules="[val => !!val || '*']" />
                    </div>
                    <div class="col-6 q-pl-sm q-pr-sm q-pt-md">
                        <q-input color="positive" dense v-model="formData.lastName" label="* Last Name"
                            :rules="[val => !!val || '*']" />
                    </div>
                    <div class="col-6 q-pl-sm q-pr-sm q-pt-md">
                        <q-input color="positive" dense v-model="formData.email" label="* Email Address"
                            :rules="[val => !!val || '*']" />
                    </div>
                    <div class="col-6 q-pl-sm q-pr-sm q-pt-md">
                        <q-select dense color="positive" v-model="formData.region"
                            :options="['EMEA', 'Americas', 'Asia', 'China']">
                            <template v-slot:prepend>
                                <div class="text-subtitle2">
                                    {{ $t('* Region') }}:
                                </div>
                            </template>
                        </q-select>
                    </div>
                    <div class="col-6 q-pl-sm q-pr-sm q-pt-md">
                        <q-input color="positive" dense v-model="formData.phoneNumber" label="Phone Number" />
                    </div>
                    <div class="col-6 q-pl-sm q-pr-sm q-pt-md">
                        <q-input color="positive" dense v-model="formData.companyName"
                            label="Company/Organization Name" />
                    </div>
                    <div class="col q-pl-sm q-pr-sm q-pt-md">
                        <q-input color="positive" dense v-model="formData.message" label="What's Your Need?"
                            type="textarea" />
                    </div>
                </q-form>

                <div class="q-pl-sm q-gutter-sm row reverse q-pr-sm q-pt-md text-right">
                    <q-btn label="Submit" :loading="isPostingMessage" color="positive" @click="postCollector" />
                    <q-btn label="Cancel" color="grey-5" v-close-popup />
                    <div style="margin-right: auto;">
                        <q-checkbox color="positive" v-model="isAgreePolicy">
                            <span class="text-black">I have read and accpet</span>
                        </q-checkbox>
                        <a href="https://www.deltaww.com/en-US/information/privacy-policy" target="_blank"
                            class="q-pl-sm">Delta Privacy Policy</a>
                    </div>
                </div>
            </q-card-section>

        </q-card>
    </q-dialog>
</template>

<script>

export default {
    name: 'Contact-Us',
    props: ['showDialog'],
    data() {
        return {
            isPostingMessage: false,
            isAgreePolicy: false,
            formData: {
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                companyName: '',
                region: 'EMEA',
                message: ''
            }
        }
    },
    computed: {
        selectedProjector() {
            return this.$store.getters['dataSource/selectedProjector'] || {}
        },
        selectedLens() {
            return this.$store.getters['dataSource/selectedLens']
        }
    },
    methods: {
        show() {
            this.formData.message = ''
        },
        hideDialog() {
            this.$emit('update:showDialog', false)
        },
        postCollector() {
            this.$refs.contactForm.validate().then(isValidated => {
                if (isValidated) {
                    if (!this.isAgreePolicy) {
                        this.$q.notify({
                            color: 'red-5',
                            textColor: 'white',
                            icon: 'warning',
                            message: 'You need to accept the privacy policy first'
                        })
                        return
                    }
                    this.formData.message = `Model Name:[${this.selectedProjector.ModelName}], Lens  Name:[${this.selectedLens ? this.selectedLens['Part Name'] : 'Fixed'}], Message :${this.formData.message}`

                    const param = new URLSearchParams()
                    param.append('fname', this.formData.firstName)
                    param.append('lname', this.formData.lastName)
                    param.append('email', this.formData.email)
                    param.append('phone', this.formData.phoneNumber)
                    param.append('region', this.formData.region)
                    param.append('company', this.formData.companyName)
                    param.append('need', this.formData.message)

                    this.isPostingMessage = true
                    this.$axios({
                        url: 'https://service.launchnovo.com/api/vivitek/service',
                        method: 'POST',
                        data: param,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).then(() => {
                        this.isPostingMessage = false
                        this.$emit('messageCollected', this.formData)
                        this.hideDialog()
                    })

                    // this.isPostingMessage = false
                    // this.$emit('messageCollected', this.formData)
                    // this.hideDialog()
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
