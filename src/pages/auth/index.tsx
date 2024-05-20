import { useEffect } from 'react'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import Logo from '@/assets/icons/logo.svg'
import CustomForm, { useForm } from '@/components/form/form'
import { InputField } from '@/components/input-field/input-field'
import Button from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FormField } from '@/components/ui/form'
import { routes } from '@/constants/routes'
import { useAuthMutation } from '@/redux/api/auth'
import { ErrorInterface } from '@/types/interface'
import { setCookieValue } from '@/utils/cookie'

const authSchema = z.object({
    phone: z.string().min(10, i18next.t('error.required')),
    password: z.string().min(1, i18next.t('error.required')),
    remember_me: z.boolean(),
})

export default function AuthPage() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const form = useForm({
        schema: authSchema,
        defaultValues: { phone: '', password: '', remember_me: false },
    })

    const [authUser, { data, error, isSuccess }] = useAuthMutation()

    const onSubmit = (authData: z.infer<typeof authSchema>) => {
        authUser({
            phone: `${authData.phone}`,
            password: authData.password,
        })
    }

    useEffect(() => {
        if (isSuccess) {
            setCookieValue('accessToken', data.accessToken!)
            setCookieValue('refreshToken', data.refreshToken!)

            navigate(routes.CATEGORIES)
        }
    }, [isSuccess])

    useEffect(() => {
        if (error) {
            const errorData = error as ErrorInterface
            form.setError('password', {
                message: errorData.data?.message
                    ? errorData.data?.message
                    : t('error.default'),
            })
        }
    }, [error])

    return (
        <div className="flex w-screen h-screen items-center mobile:justify-center select-none">
            <div className="absolute w-screen h-screen z-[-1] ">
                <div className="absolute w-full h-full bg-black/50" />
                <img
                    src="src/assets/images/login.png"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex flex-col w-[500px] md:mx-32 mobile:mx-8 p-8 py-14 items-center bg-white shadow-lg rounded-xl ">
                <Logo />
                <h1 className="text-3xl font-bold">{t('sign.in.title')}</h1>
                <p className="w-[240px] mb-8 text-center">
                    {t('sign.in.description')}
                </p>
                <CustomForm className="w-full" form={form} onSubmit={onSubmit}>
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <InputField
                                label={t('phone')}
                                className="mt-8"
                                inputClassName="h-14"
                                {...field}
                            />
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <InputField
                                label={t('password')}
                                className="mt-8"
                                inputClassName="h-14"
                                {...field}
                            />
                        )}
                    />
                    <div className="flex items-center justify-between mt-6">
                        <FormField
                            control={form.control}
                            name="remember_me"
                            render={({ field }) => (
                                <Checkbox
                                    label={t('remember.me')}
                                    id="remember_me"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                        <Button
                            variant="ghost"
                            className="h-auto py-0"
                            type="button"
                        >
                            {t('forgot.password')}
                        </Button>
                    </div>
                    <Button size="lg" className="w-full mt-8">
                        {t('action.sign.in')}
                    </Button>
                </CustomForm>
            </div>
        </div>
    )
}