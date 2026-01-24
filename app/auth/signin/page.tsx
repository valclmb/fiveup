import Typography from '@/components/ui/typography'
import SignInForm from './signin-form'

// function SignInForm2() {
//   const searchParams = useSearchParams()
//   const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
//   const error = searchParams.get('error')

//   const [formData, setFormData] = useState({ email: '', password: '' })
//   const [isLoading, setIsLoading] = useState(false)
//   const [isGoogleLoading, setIsGoogleLoading] = useState(false)
//   const [formError, setFormError] = useState('')

//   // Gestion de la connexion Google
//   const handleGoogleSignIn = async () => {
//     setIsGoogleLoading(true)
//     try {
//       await signIn('google', { callbackUrl })
//     } catch (error) {
//       console.error('Erreur Google Sign In:', error)
//       setIsGoogleLoading(false)
//     }
//   }

//   // Gestion de la connexion Email/Password (à implémenter plus tard)
//   const handleCredentialsSignIn = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setFormError('')
//     setIsLoading(true)

//     try {
//       const result = await signIn('credentials', {
//         email: formData.email,
//         password: formData.password,
//         redirect: false,
//       })

//       if (result?.error) {
//         setFormError(result.error)
//       } else if (result?.ok) {
//         window.location.href = callbackUrl
//       }
//     } catch (error) {
//       setFormError('Une erreur est survenue')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Messages d'erreur personnalisés
//   const getErrorMessage = () => {
//     switch (error) {
//       case 'OAuthAccountNotLinked':
//         return 'Cet email est déjà utilisé avec une autre méthode de connexion.'
//       case 'EmailSignin':
//         return 'Erreur lors de l\'envoi de l\'email de connexion.'
//       case 'Callback':
//         return 'Erreur lors de la connexion. Veuillez réessayer.'
//       case 'OAuthSignin':
//         return 'Erreur lors de la connexion avec Google.'
//       case 'OAuthCallback':
//         return 'Erreur lors du retour de Google.'
//       case 'SessionRequired':
//         return 'Veuillez vous connecter pour accéder à cette page.'
//       default:
//         return error ? 'Une erreur est survenue lors de la connexion.' : ''
//     }
//   }

//   const errorMessage = getErrorMessage()

//   return (
//     <div className="flex min-h-screen  bg-gray-50 gap-48 p-4 py-12 sm:px-6 lg:px-8">

//       <Card className=" bg-[#10CEA5]  relative flex w-1/2 overflow-hidden rounded-3xl border p-14">
//         <AnimatedGridPattern
//           width={120}
//           height={120}
//           x={-1}
//           y={-20}
//           strokeDasharray={3}
//           numSquares={20}
//           maxOpacity={1}
//           duration={3}
//           repeatDelay={1}

//           className={cn(
//             // "mask-[radial-gradient(800px_circle_at_center,white,transparent)]",
//             "z-10 -x-0 inset-y-[-30%] h-[200%]",
//             "stroke-white/40",
//             "text-[#40D9B3]" // Couleur des carrés animés (utilise currentColor)
//           )}
//         />
//         <div className='z-50 flex flex-col justify-between gap-32'>
//           <Image width={250} height={50} src="/logo-white.svg" alt="logo" />
//           <Typography variant="h2" className="text-2xl md:text-[42px] mb-0">Welcome to FiveUp</Typography>

//         </div>
//         <RatingCard platform="trustpilot" whiteMode={true} className=" left-32 bottom-82" delay={1} />
//         <RatingCard platform="google" whiteMode={true} className=" left-50 bottom-42" delay={1} />
//         <RatingCard platform="google" whiteMode={true} className=" right-32 bottom-68" delay={1} />

//         {/* <div className="flex flex-col items-center justify-center text-center">
//           <Typography variant="h2" className="text-2xl lg:text-center md:text-[42px] mb-0">Ready to make reviews your unfair advantage?</Typography>
//           <Typography variant="description" className="text-sm  md:text-base text-muted-foreground">Plug FiveUp into your stack and turn every customer into social proof – without adding more work to your team.</Typography>
//           <Button className="mt-5 z-10 px-8">Commencer maintenant</Button>
//         </div> */}

//       </Card>


//       <div className="w-1/2 space-y-8">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-gray-900">Connexion</h1>
//         </div>

//         <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
//           {(errorMessage || formError) && (
//             <div className="mb-4 text-sm text-red-600">
//               {errorMessage || formError}
//             </div>
//           )}

//           <Button
//             onClick={handleGoogleSignIn}
//             disabled={isGoogleLoading || isLoading}
//             variant="outline"
//             className="w-full mb-4"
//             type="button"
//           >
//             {isGoogleLoading ? 'Chargement...' : 'Continuer avec Google'}
//           </Button>

//           <div className="relative my-4">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300" />
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="bg-white px-2 text-gray-500">Ou</span>
//             </div>
//           </div>

//           <form onSubmit={handleCredentialsSignIn} className="space-y-4">
//             <Input
//               id="email"
//               type="email"
//               value={formData.email}
//               onChange={(e) =>
//                 setFormData({ ...formData, email: e.target.value })
//               }
//               placeholder="Email"
//               required
//               disabled={isLoading || isGoogleLoading}
//             />

//             <Input
//               id="password"
//               type="password"
//               value={formData.password}
//               onChange={(e) =>
//                 setFormData({ ...formData, password: e.target.value })
//               }
//               placeholder="Mot de passe"
//               required
//               disabled={isLoading || isGoogleLoading}
//             />

//             <Button
//               type="submit"
//               className="w-full"
//               disabled={isLoading || isGoogleLoading}
//             >
//               {isLoading ? 'Connexion...' : 'Se connecter'}
//             </Button>
//           </form>

//           <div className="mt-4 text-center text-sm">
//             <Link href="/auth/signup" className="text-blue-600 hover:text-blue-500">
//               Pas de compte ? Créer un compte
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div >
//   )
// }

export default function SignInPage() {
  return (
    <>
      <Typography variant="h2" className="mb-2">Sign in</Typography>
      <SignInForm />
    </>
  )
}