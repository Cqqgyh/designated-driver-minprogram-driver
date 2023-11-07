<template>
  <tm-app>
    <tm-form @submit="confirm" ref="formRef" v-model="formData" :label-width="190">
      <!--      身份证正面-->
      <tm-form-item required label="身份证正面" field="idcardFrontUrl" :rules="{ required: true, message: '请上传身份证正面' }">
        <ocr-upload
          :maxFile="1"
          :rows="3"
          :width="420"
          :suffixUrl="'/ocr/idCardOcr'"
          :default-value="formData.idcardFrontUrl"
          v-model="formData.idcardFrontUrl"
        ></ocr-upload>
      </tm-form-item>
      <!--      身份证反面-->
      <tm-form-item required label="身份证反面" field="idcardBackUrl" :rules="{ required: true, message: '请上传身份证反面' }">
        <ocr-upload
          :maxFile="1"
          :rows="3"
          :width="420"
          :suffixUrl="'/ocr/idCardOcr'"
          :default-value="formData.idcardBackUrl"
          v-model="formData.idcardBackUrl"
        ></ocr-upload>
      </tm-form-item>
      <!--      驾驶证正面-->
      <tm-form-item required label="驾驶证正面" field="driverLicenseFrontUrl" :rules="{ required: true, message: '请上传驾驶证正面' }">
        <ocr-upload
          :maxFile="1"
          :rows="3"
          :width="420"
          :suffixUrl="'/ocr/driverLicenseOcr'"
          :default-value="formData.driverLicenseFrontUrl"
          v-model="formData.driverLicenseFrontUrl"
        ></ocr-upload>
      </tm-form-item>
      <!--      手持身份证-->
      <tm-form-item required label="手持身份证" field="idcardHandUrl" :rules="{ required: true, message: '请上传手持身份证' }">
        <ocr-upload
          :maxFile="1"
          :rows="3"
          :width="420"
          :suffixUrl="'/cos/upload'"
          :default-value="formData.idcardHandUrl"
          v-model="formData.idcardHandUrl"
        ></ocr-upload>
      </tm-form-item>
      <!--      手持驾驶证-->
      <tm-form-item required label="手持驾驶证" field="driverLicenseHandUrl" :rules="{ required: true, message: '请上传手持驾驶证' }">
        <ocr-upload
          :maxFile="1"
          :rows="3"
          :width="420"
          :suffixUrl="'/cos/upload'"
          :default-value="formData.driverLicenseHandUrl"
          v-model="formData.driverLicenseHandUrl"
        ></ocr-upload>
      </tm-form-item>
      <!--      手机号-->
      <tm-form-item
        required
        label="手机号"
        showError
        field="phone"
        :rules="[
          { required: true, message: '不能为空', validator: (val) => val.length > 0 },
          { required: true, message: '请输入正确的手机号', validator: (val) => mobile(val) }
        ]"
      >
        <!-- 不要问我为什么用v-model.lazy，我很受伤。 -->
        <tm-input
          :inputPadding="[0, 0]"
          placeholder="请输入手机号"
          v-model.lazy="formData.phone"
          :transprent="true"
          :showBottomBotder="false"
        ></tm-input>
      </tm-form-item>
      <!--      紧急联系人-->
      <tm-form-item
        required
        label="紧急联系人"
        showError
        field="contactName"
        :rules="[{ required: true, message: '不能为空', validator: (val) => val.length > 0 }]"
      >
        <!-- 不要问我为什么用v-model.lazy，我很受伤。 -->
        <tm-input
          :inputPadding="[0, 0]"
          placeholder="请输入紧急联系人"
          v-model.lazy="formData.contactName"
          :transprent="true"
          :showBottomBotder="false"
        ></tm-input>
      </tm-form-item>
      <!--      紧急联系人手机号-->
      <tm-form-item
        required
        label="紧急联系人手机号"
        showError
        field="contactPhone"
        :rules="[
          { required: true, message: '不能为空', validator: (val) => val.length > 0 },
          { required: true, message: '请输入正确的手机号', validator: (val) => mobile(val) }
        ]"
      >
        <!-- 不要问我为什么用v-model.lazy，我很受伤。 -->
        <tm-input
          :inputPadding="[0, 0]"
          placeholder="请输入手机号"
          v-model.lazy="formData.contactPhone"
          :transprent="true"
          :showBottomBotder="false"
        ></tm-input>
      </tm-form-item>
      <!--      	紧急联系人关系-->
      <tm-form-item
        required
        label="紧急联系人关系"
        showError
        field="contactRelationship"
        :rules="[{ required: true, message: '不能为空', validator: (val) => val.length > 0 }]"
      >
        <!-- 不要问我为什么用v-model.lazy，我很受伤。 -->
        <tm-input
          :inputPadding="[0, 0]"
          placeholder="请输入紧急联系人关系"
          v-model.lazy="formData.contactRelationship"
          :transprent="true"
          :showBottomBotder="false"
        ></tm-input>
      </tm-form-item>
      <!--      身份信息-->
      <div v-if="formData?.idcardFrontUrl[0]?.originalData && formData?.idcardBackUrl[0]?.originalData">
        <div class="mt-24 text-weight-b">身份信息</div>
        <tm-form-item label="真实姓名">
          <!-- 不要问我为什么用v-model.lazy，我很受伤。 -->
          <tm-input
            :inputPadding="[0, 0]"
            disabled
            :modelValue="formData.idcardFrontUrl[0].originalData.name"
            :transprent="true"
            :showBottomBotder="true"
          ></tm-input>
        </tm-form-item>
        <tm-form-item label="性别">
          <!-- 不要问我为什么用v-model.lazy，我很受伤。 -->
          <tm-input
            :inputPadding="[0, 0]"
            disabled
            :modelValue="formData.idcardFrontUrl[0].originalData.gender == 1 ? '男' : '女'"
            :transprent="true"
            :showBottomBotder="true"
          ></tm-input>
        </tm-form-item>
        <tm-form-item label="身份证号码">
          <!-- 不要问我为什么用v-model.lazy，我很受伤。 -->
          <tm-input
            :inputPadding="[0, 0]"
            disabled
            :modelValue="formData.idcardFrontUrl[0].originalData.idcardNo"
            :transprent="true"
            :showBottomBotder="true"
          ></tm-input>
        </tm-form-item>
        <tm-form-item label="生日">
          <!-- 不要问我为什么用v-model.lazy，我很受伤。 -->
          <tm-input
            :inputPadding="[0, 0]"
            disabled
            :modelValue="formData.idcardFrontUrl[0].originalData.birthday"
            :transprent="true"
            :showBottomBotder="true"
          ></tm-input>
        </tm-form-item>
        <tm-form-item label="身份证地址">
          <!-- 不要问我为什么用v-model.lazy，我很受伤。 -->
          <tm-input
            :inputPadding="[0, 0]"
            disabled
            :modelValue="formData.idcardFrontUrl[0].originalData.idcardAddress"
            :transprent="true"
            :showBottomBotder="true"
          ></tm-input>
        </tm-form-item>
        <tm-form-item label="身份证过期时间">
          <!-- 不要问我为什么用v-model.lazy，我很受伤。 -->
          <tm-input
            :inputPadding="[0, 0]"
            disabled
            :modelValue="formData.idcardFrontUrl[0].originalData.idcardExpire || formData.idcardBackUrl[0].originalData.idcardExpire"
            :transprent="true"
            :showBottomBotder="true"
          ></tm-input>
        </tm-form-item>
      </div>
      <!--      驾驶证-->
      <div v-if="formData?.driverLicenseFrontUrl[0]?.originalData">
        <div class="mt-24 text-weight-b">驾驶证信息</div>
        <tm-form-item label="准驾车型">
          <!-- 不要问我为什么用v-model.lazy，我很受伤。 -->
          <tm-input
            :inputPadding="[0, 0]"
            disabled
            :modelValue="formData.driverLicenseFrontUrl[0].originalData.driverLicenseClazz"
            :transprent="true"
            :showBottomBotder="true"
          ></tm-input>
        </tm-form-item>
        <tm-form-item label="驾驶证证件号">
          <tm-input
            :inputPadding="[0, 0]"
            disabled
            :modelValue="formData.driverLicenseFrontUrl[0].originalData.driverLicenseNo"
            :transprent="true"
            :showBottomBotder="true"
          ></tm-input>
        </tm-form-item>
        <tm-form-item label="驾驶证有效期">
          <tm-input
            :inputPadding="[0, 0]"
            disabled
            :modelValue="formData.driverLicenseFrontUrl[0].originalData.driverLicenseExpire"
            :transprent="true"
            :showBottomBotder="true"
          ></tm-input>
        </tm-form-item>
        <tm-form-item label="驾驶证初次领证日期">
          <tm-input
            :inputPadding="[0, 0]"
            disabled
            :modelValue="formData.driverLicenseFrontUrl[0].originalData.driverLicenseIssueDate"
            :transprent="true"
            :showBottomBotder="true"
          ></tm-input>
        </tm-form-item>
      </div>

      <tm-form-item :border="false">
        <view class="flex flex-row">
          <view class="flex-1 mr-32">
            <!--   form-type="submit"         :click-fun="confirm"-->
            <tm-button form-type="submit" label="提交" block></tm-button>
          </view>
          <view class="flex-1">
            <tm-button :shadow="0" text @click="back" label="返回" block></tm-button>
          </view>
        </view>
      </tm-form-item>
    </tm-form>
  </tm-app>
</template>
<script setup lang="ts">
import tmForm from '@/tmui/components/tm-form/tm-form.vue'
import { carNo, mobile } from '@/utils/validate'
import { getDriverAuthInfo, updateUserInfo } from '@/api/user'
import { DriverCardOcrInterface, IdCardOcrInterface, UpdateUserInfoInterface } from '@/api/user/types'
import { Gender } from '@/config/constEnums'
const props = defineProps({
  orderId: {
    type: Number,
    required: true
  }
})
const formRef = ref<InstanceType<typeof tmForm>>()
const formData = ref({
  idcardFrontUrl: [] as { url: string; name: string; originalData: IdCardOcrInterface }[],
  idcardBackUrl: [] as { url: string; name: string; originalData: IdCardOcrInterface }[],
  driverLicenseFrontUrl: [] as { url: string; name: string; originalData: DriverCardOcrInterface }[],
  idcardHandUrl: [] as { url: string; name: string; originalData: { url: string; showUrl: string } }[],
  driverLicenseHandUrl: [] as { url: string; name: string; originalData: { url: string; showUrl: string } }[],
  phone: '',
  contactName: '',
  contactPhone: '',
  contactRelationship: ''
})

// 提交
async function confirm(validateInfo: {
  data: Partial<typeof formData.value> // 表单数据
  // 所有与form-item绑定的filed字段校验的结果数组。
  result: {
    message: string //校验后的提示文本
    validator: boolean //是否校验通过
  }[]
  isPass: boolean //是否校验通过
}) {
  console.log('validateInfo', validateInfo)
  console.log('formData', formData.value)
  // 如果验证不通过，不提交
  if (!validateInfo.isPass) return
  console.log('通过检验')
  // 同步验证通过，提交表单
  let params: UpdateUserInfoInterface = {
    phone: formData.value.phone,
    contactName: formData.value.contactName,
    contactPhone: formData.value.contactPhone,
    contactRelationship: formData.value.contactRelationship,
    name: formData.value.idcardFrontUrl[0].originalData.name,
    gender: formData.value.idcardFrontUrl[0].originalData.gender as unknown as Gender,
    birthday: formData.value.idcardFrontUrl[0].originalData.birthday,
    idcardNo: formData.value.idcardFrontUrl[0].originalData.idcardNo,
    idcardAddress: formData.value.idcardFrontUrl[0].originalData.idcardAddress,
    idcardExpire: formData.value.idcardFrontUrl[0].originalData.idcardExpire || formData.value.idcardBackUrl[0].originalData.idcardExpire,
    idcardFrontUrl: formData.value.idcardFrontUrl[0].originalData.idcardFrontUrl,
    idcardBackUrl: formData.value.idcardBackUrl[0].originalData.idcardBackUrl,
    idcardHandUrl: formData.value.idcardHandUrl[0].originalData.url,
    driverLicenseClazz: formData.value.driverLicenseFrontUrl[0].originalData.driverLicenseClazz,
    driverLicenseNo: formData.value.driverLicenseFrontUrl[0].originalData.driverLicenseNo,
    driverLicenseExpire: formData.value.driverLicenseFrontUrl[0].originalData.driverLicenseExpire,
    driverLicenseIssueDate: formData.value.driverLicenseFrontUrl[0].originalData.driverLicenseIssueDate,
    driverLicenseFrontUrl: formData.value.driverLicenseFrontUrl[0].originalData.driverLicenseFrontUrl,
    driverLicenseBackUrl: '',
    driverLicenseHandUrl: formData.value.driverLicenseHandUrl[0].originalData.url
  }
  console.log('params', params)
  await updateUserInfo(params)
  uni.navigateTo({
    url: '/pages/facialIdentification/facialIdentification?creatFaceModel=true'
  })
}
// 获取司机认证信息
async function getDriverInfo() {
  let { data } = await getDriverAuthInfo()
  // 如果存在
  if (data.contactPhone) {
    formData.value = {
      idcardFrontUrl: [
        {
          url: data.idcardFrontShowUrl,
          name: data.idcardFrontShowUrl,
          originalData: {
            name: data.name,
            gender: data.gender,
            birthday: data.birthday,
            idcardNo: data.idcardNo,
            idcardAddress: data.idcardAddress,
            idcardExpire: data.idcardExpire,
            idcardFrontUrl: data.idcardFrontUrl,
            idcardFrontShowUrl: data.idcardFrontShowUrl,
            idcardBackUrl: data.idcardBackUrl,
            idcardBackShowUrl: data.idcardBackShowUrl
          }
        }
      ],
      idcardBackUrl: [
        {
          url: data.idcardBackShowUrl,
          name: data.idcardBackShowUrl,
          originalData: {
            name: data.name,
            gender: data.gender,
            birthday: data.birthday,
            idcardNo: data.idcardNo,
            idcardAddress: data.idcardAddress,
            idcardExpire: data.idcardExpire,
            idcardFrontUrl: data.idcardFrontUrl,
            idcardFrontShowUrl: data.idcardFrontShowUrl,
            idcardBackUrl: data.idcardBackUrl,
            idcardBackShowUrl: data.idcardBackShowUrl
          }
        }
      ],
      driverLicenseFrontUrl: [
        {
          url: data.driverLicenseFrontShowUrl,
          name: data.driverLicenseFrontShowUrl,
          originalData: {
            name: '',
            driverLicenseClazz: data.driverLicenseClazz,
            driverLicenseNo: data.driverLicenseNo,
            driverLicenseExpire: data.driverLicenseExpire,
            driverLicenseIssueDate: data.driverLicenseIssueDate,
            driverLicenseFrontUrl: data.driverLicenseFrontUrl,
            driverLicenseFrontShowUrl: data.driverLicenseFrontShowUrl,
            driverLicenseBackUrl: data.driverLicenseBackUrl,
            driverLicenseBackShowUrl: data.driverLicenseBackShowUrl
          }
        }
      ],
      idcardHandUrl: [
        {
          url: data.idcardHandShowUrl,
          name: data.idcardHandShowUrl,
          originalData: {
            url: data.idcardHandUrl,
            showUrl: data.idcardHandShowUrl
          }
        }
      ],
      driverLicenseHandUrl: [
        {
          url: data.driverLicenseHandShowUrl,
          name: data.driverLicenseHandShowUrl,
          originalData: {
            url: data.driverLicenseHandUrl,
            showUrl: data.driverLicenseHandShowUrl
          }
        }
      ],
      phone: data.phone,
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      contactRelationship: data.contactRelationship
    }
  }
}
// 返回
function back() {
  uni.navigateBack()
}
onLoad(() => {
  console.log('onLoad-props', props)
  getDriverInfo()
})
</script>

<style scoped lang="scss"></style>
