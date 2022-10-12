import { FC, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {Button, Anchor, TextInput, PasswordInput, SimpleGrid} from '@mantine/core'
import { useInputState } from '@mantine/hooks'
import { showNotification, updateNotification } from '@mantine/notifications'
import { mdiCheck, mdiClose } from '@mdi/js'
import { Icon } from '@mdi/react'
import AccountView from '@Components/AccountView'
import StrengthPasswordInput from '@Components/StrengthPasswordInput'
import { usePageTitle } from '@Utils/usePageTitle'
import { useReCaptcha } from '@Utils/useRecaptcha'
import api, { RegisterStatus } from '@Api'

const RegisterStatusMap = new Map([
  [
    RegisterStatus.LoggedIn,
    {
      message: '注册成功',
    },
  ],
  [
    RegisterStatus.AdminConfirmationRequired,
    {
      title: '注册请求已发送',
      message: '请等待管理员审核激活~',
    },
  ],
  [
    RegisterStatus.EmailConfirmationRequired,
    {
      title: '一封注册邮件已发送',
      message: '请检查你的邮箱及垃圾邮件~',
    },
  ],
  [undefined, undefined],
])

const Register: FC = () => {
  const [pwd, setPwd] = useInputState('')
  const [retypedPwd, setRetypedPwd] = useInputState('')
  const [uname, setUname] = useInputState('')
  const [email, setEmail] = useInputState('')
  const [realName, setRealname] = useInputState('')
  const [stdNumber, setStdNumber] = useInputState('')
  const [phoneNumber, setPhoneNumber] = useInputState('')
  const [qqNumber, setQqNumber] = useInputState('')
  const [disabled, setDisabled] = useState(false)

  const navigate = useNavigate()
  const reCaptcha = useReCaptcha('register')

  usePageTitle('注册')

  const onRegister = async (event: React.FormEvent) => {
    event.preventDefault()

    if (pwd !== retypedPwd) {
      showNotification({
        color: 'red',
        title: '请检查输入',
        message: '重复密码有误',
        icon: <Icon path={mdiClose} size={1} />,
        disallowClose: true,
      })
      return
    }

    const token = await reCaptcha?.getToken()

    if (!token) {
      showNotification({
        color: 'orange',
        title: '请等待验证码……',
        message: '请稍后重试',
        loading: true,
        disallowClose: true,
      })
      return
    }

    setDisabled(true)

    showNotification({
      color: 'orange',
      id: 'register-status',
      title: '请求已发送……',
      message: '等待服务器验证',
      loading: true,
      autoClose: false,
      disallowClose: true,
    })

    api.account
      .accountRegister({
        userName: uname,
        password: pwd,
        email: email,
        realName: realName,
        stdNumber: stdNumber,
        qqNumber: qqNumber,
        phoneNumber: phoneNumber,
        gToken: token,
      })
      .then((res) => {
        const data = RegisterStatusMap.get(res.data.data)
        if (data) {
          updateNotification({
            id: 'register-status',
            color: 'teal',
            title: data.title,
            message: data.message,
            icon: <Icon path={mdiCheck} size={1} />,
            disallowClose: true,
          })

          if (res.data.data === RegisterStatus.LoggedIn) navigate('/')
          else navigate('/account/login')
        }
      })
      .catch((err) => {
        updateNotification({
          id: 'register-status',
          color: 'red',
          title: '遇到了问题',
          message: `${err.response.data.title}`,
          icon: <Icon path={mdiClose} size={1} />,
          disallowClose: true,
        })
      })
      .finally(() => {
        setDisabled(false)
      })
  }

  return (
    <AccountView onSubmit={onRegister}>
      <TextInput
        required
        label="邮箱"
        type="email"
        placeholder="ctf@example.com"
        style={{ width: '100%' }}
        value={email}
        disabled={disabled}
        onChange={(event) => setEmail(event.currentTarget.value)}
      />
      <TextInput
        required
        label="用户名"
        type="text"
        placeholder="ctfer"
        style={{ width: '100%' }}
        value={uname}
        disabled={disabled}
        onChange={(event) => setUname(event.currentTarget.value)}
      />
      <StrengthPasswordInput
        value={pwd}
        onChange={(event) => setPwd(event.currentTarget.value)}
        disabled={disabled}
      />
      <PasswordInput
        required
        value={retypedPwd}
        onChange={(event) => setRetypedPwd(event.currentTarget.value)}
        disabled={disabled}
        label="重复密码"
        style={{ width: '100%' }}
        error={pwd !== retypedPwd}
      />
      <SimpleGrid cols={2}>
        <TextInput
          required
          label="真实姓名"
          type="text"
          placeholder="张三"
          style={{ width: '100%' }}
          value={realName}
          disabled={disabled}
          onChange={(event) => setRealname(event.currentTarget.value)}
        />
        <TextInput
          required
          label="一卡通号"
          type="text"
          placeholder="213... / 220..."
          style={{ width: '100%' }}
          value={stdNumber}
          disabled={disabled}
          onChange={(event) => setStdNumber(event.currentTarget.value)}
        />
      </SimpleGrid>
      <SimpleGrid cols={2}>
        <TextInput
          required
          label="手机号"
          type="text"
          placeholder="19201680101"
          style={{ width: '100%' }}
          value={phoneNumber}
          disabled={disabled}
          onChange={(event) => setPhoneNumber(event.currentTarget.value)}
        />
        <TextInput
          required
          label="QQ 号"
          type="text"
          placeholder="^\d{6,10}$"
          style={{ width: '100%' }}
          value={qqNumber}
          disabled={disabled}
          onChange={(event) => setQqNumber(event.currentTarget.value)}
        />
      </SimpleGrid>
      <Anchor
        sx={(theme) => ({
          fontSize: theme.fontSizes.xs,
          alignSelf: 'end',
        })}
        component={Link}
        to="/account/login"
      >
        已经拥有账户？
      </Anchor>
      <Button type="submit" fullWidth onClick={onRegister} disabled={disabled}>
        注册
      </Button>
    </AccountView>
  )
}

export default Register
