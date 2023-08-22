<template>
  <tm-app>
    <tm-form @submit="confirm" ref="formRef" v-model="formData" :label-width="190">
      <!--      头像-->
      <tm-form-item required label="头像" field="avatar" :rules="{ required: true, message: '请上传头像' }">
        <upload-images :maxFile="1" :rows="3" :width="420" :default-value="formData.avatar" v-model="formData.avatar"></upload-images>
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
          type="idCard"
          v-model.lazy="formData.phone"
          placeholder="请输入手机号"
          :transprent="true"
          :showBottomBotder="false"
        ></tm-input>
      </tm-form-item>
      <!--      身份证号码-->
      <tm-form-item
        required
        label="身份证号码"
        showError
        field="idCard"
        :rules="[
          { required: true, message: '不能为空', validator: (val) => val.length > 0 },
          { required: true, message: '请输入正确的身份证号', validator: (val) => idCard(val) }
        ]"
      >
        <tm-input
          :inputPadding="[0, 0]"
          type="idCard"
          placeholder="请输入身份证号码"
          v-model.lazy="formData.idCard"
          :transprent="true"
          :showBottomBotder="false"
        ></tm-input>
      </tm-form-item>
      <!--      车牌-->
      <tm-form-item
        required
        label="车牌号"
        showError
        field="carNumber"
        :rules="[
          { required: true, message: '不能为空', validator: (val) => val.length > 0 },
          { required: true, message: '请输入正确的车牌号', validator: (val) => carNo(val) }
        ]"
      >
        <!-- 不要问我为什么用v-model.lazy，我很受伤。 -->
        <tm-input
          :inputPadding="[0, 0]"
          placeholder="请输入车牌号"
          v-model.lazy="formData.carNumber"
          :transprent="true"
          :showBottomBotder="false"
        ></tm-input>
      </tm-form-item>
      <!--      紧急联系人-->
      <tm-form-item
        required
        label="紧急联系人"
        showError
        field="emergencyContactName"
        :rules="[{ required: true, message: '不能为空', validator: (val) => val.length > 0 }]"
      >
        <!-- 不要问我为什么用v-model.lazy，我很受伤。 -->
        <tm-input
          :inputPadding="[0, 0]"
          placeholder="请输入紧急联系人姓名"
          v-model.lazy="formData.emergencyContactName"
          :transprent="true"
          :showBottomBotder="false"
        ></tm-input>
      </tm-form-item>
      <!--      紧急联系人手机号-->
      <tm-form-item
        required
        label="紧急联系人手机号"
        showError
        field="emergencyContactPhone"
        :rules="[
          { required: true, message: '不能为空', validator: (val) => val.length > 0 },
          { required: true, message: '请输入正确的手机号', validator: (val) => mobile(val) }
        ]"
      >
        <!-- 不要问我为什么用v-model.lazy，我很受伤。 -->
        <tm-input
          :inputPadding="[0, 0]"
          type="number"
          placeholder="请输入紧急联系人手机号"
          v-model.lazy="formData.emergencyContactPhone"
          :transprent="true"
          :showBottomBotder="false"
        ></tm-input>
      </tm-form-item>
      <!--      驾龄-->
      <tm-form-item
        required
        label="驾龄"
        showError
        field="drivingAge"
        :rules="[
          { required: true, message: '不能为空', validator: (val) => val.length > 0 },
          { required: true, message: '请输入正确的驾龄', validator: (val) => number(val) && +val > 0 }
        ]"
      >
        <tm-input
          :inputPadding="[0, 0]"
          placeholder="请输入驾龄"
          type="number"
          v-model.lazy="formData.drivingAge"
          suffixLabel="年"
          :transprent="true"
          :showBottomBotder="false"
        ></tm-input>
      </tm-form-item>
      <!--      驾驶证有效期-->
      <tm-form-item
        required
        label="驾驶证有效期"
        field="drivingLicenseValidity"
        :rules="[
          { required: true, message: '请选择驾驶证有效期' },
          {
            required: true,
            message: '请选择起止日期',
            validator: (val) => val[0] && val[1]
          }
        ]"
      >
        <view
          @click="showDrivingLicenseValidityDrawer = !showDrivingLicenseValidityDrawer"
          :class="{ 'text-gray-2': !drivingLicenseValidityStr }"
          class="flex flex-row flex-row-center-between"
        >
          <text>{{ drivingLicenseValidityStr || '请选择时间' }}</text>
          <tm-icon :userInteractionEnabled="false" :font-size="24" name="tmicon-angle-right"></tm-icon>
        </view>
        <tm-drawer v-model:show="showDrivingLicenseValidityDrawer" :height="900" hideHeader>
          <view class="pa-16 pt-50">
            <tm-time-between
              v-model="formData.drivingLicenseValidity"
              @confirm="drivingLicenseValidityConfirmHandle"
              :quickBtn="[]"
              :async-model="false"
              format="YYYY-MM-DD"
              :start="new Date().setFullYear(new Date().getFullYear() - 10)"
              :end="new Date().setFullYear(new Date().getFullYear() + 10)"
            ></tm-time-between>
          </view>
        </tm-drawer>
      </tm-form-item>
      <tm-form-item :border="false">
        <view class="flex flex-row">
          <view class="flex-1 mr-32">
            <!--   form-type="submit"         :click-fun="confirm"-->
            <tm-button form-type="submit" label="提交表单" block></tm-button>
          </view>
          <view class="flex-1">
            <tm-button :shadow="0" text form-type="reset" label="重置表单" block></tm-button>
          </view>
        </view>
      </tm-form-item>
    </tm-form>
  </tm-app>
</template>
<script setup lang="ts">
import tmForm from '@/tmui/components/tm-form/tm-form.vue'
import { carNo, idCard, mobile, number } from '@/utils/validate'

const formRef = ref<InstanceType<typeof tmForm>>()
const formData = ref({
  avatar: [], // 头像
  phone: '', // 手机号
  idCard: '', // 身份证号码
  carNumber: '', // 车牌
  emergencyContactName: '', // 紧急联系人
  emergencyContactPhone: '', // 紧急联系人手机号
  drivingAge: '', // 驾龄
  // 驾驶证有效期
  drivingLicenseValidity: [] as string[]
})
// 监视formData.drivingLicenseValidity属性
watch(
  () => formData.value.drivingLicenseValidity,
  (val) => {
    const targetVal = val.map((item) => item.slice(0, 10))
    // 如果值相同，不赋值
    if (targetVal.toString() === val.toString()) {
      return
    }
    // 如果有一个为空，清空
    if (!val[0] || !val[1]) {
      formData.value.drivingLicenseValidity = []
      return
    }

    formData.value.drivingLicenseValidity = [...targetVal]
  }
)

// 驾驶证有效期
const showDrivingLicenseValidityDrawer = ref(false)
// 驾驶证有效期文字
const drivingLicenseValidityStr = computed(() =>
  formData.value.drivingLicenseValidity.join('~') === '~' ? '' : formData.value.drivingLicenseValidity.join('~')
)
// 选择驾驶证有效期确认方法
function drivingLicenseValidityConfirmHandle(val: string[]) {
  // console.log('drivingLicenseValidityConfirmHandle', val)
  // // 2023/08/22 17:24:49
  // // 只截取2023/08/22
  // val = val.map((item) => item.slice(0, 10))
  // formData.value.drivingLicenseValidity = [...val]
  showDrivingLicenseValidityDrawer.value = false
}

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
  // const validateInfo = await formRef.value.validate()
  console.log('validateInfo', validateInfo)
  console.log('formData', formData.value)
  // 如果验证不通过，不提交
  if (!validateInfo.isPass) return
  // 同步验证通过，提交表单
}
onLoad(() => {
  console.log('onLoad')
})
</script>

<style scoped lang="scss"></style>
