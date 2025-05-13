import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Search, CalendarCheck, BookUser, Bot } from 'lucide-react';
import Image from 'next/image';

const featureCards = [
  {
    title: 'Ver Disponibilidade',
    description: 'Consulte os horários livres e reserve a sala ideal para sua necessidade.',
    href: '/availability',
    icon: Search,
    image: 'https://picsum.photos/seed/availability/600/400',
    imageHint: 'calendar schedule'
  },
  {
    title: 'Solicitar Reserva',
    description: 'Faça um novo pedido de reserva de forma rápida e simples.',
    href: '/book',
    icon: CalendarCheck,
    image: 'https://picsum.photos/seed/booking/600/400',
    imageHint: 'booking form'
  },
  {
    title: 'Minhas Reservas',
    description: 'Acompanhe o status das suas solicitações de reserva.',
    href: '/my-bookings',
    icon: BookUser,
    image: 'https://picsum.photos/seed/status/600/400',
    imageHint: 'checklist tasks'
  },
  {
    title: 'Sugestão IA de Salas',
    description: 'Descreva seu evento e deixe nossa IA sugerir as melhores salas.',
    href: '/ai-suggest',
    icon: Bot,
    image: 'https://picsum.photos/seed/ai/600/400',
    imageHint: 'artificial intelligence'
  },
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="text-center py-12 bg-card rounded-lg shadow-md">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
          Bem-vindo ao FBSalas
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
          Seu sistema inteligente para gerenciamento e reserva de salas na FB UNI. Encontre, reserve e gerencie espaços com facilidade.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild size="lg">
            <Link href="/availability">
              Ver Salas Disponíveis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/book">Fazer uma Reserva</Link>
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold tracking-tight text-center mb-10">Nossos Recursos</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
          {featureCards.map((feature) => (
            <Card key={feature.title} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="p-0">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  width={600}
                  height={300}
                  className="w-full h-48 object-cover"
                  data-ai-hint={feature.imageHint}
                />
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <feature.icon className="h-8 w-8 text-primary" />
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                </div>
                <CardDescription className="text-base mb-4">{feature.description}</CardDescription>
                <Button variant="link" asChild className="p-0 h-auto text-primary">
                  <Link href={feature.href}>
                    Acessar Recurso
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
