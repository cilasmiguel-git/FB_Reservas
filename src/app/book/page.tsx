import BookingForm from '@/components/booking-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function BookRoomPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Solicitar Reserva de Sala</CardTitle>
          <CardDescription>
            Preencha o formulário abaixo para solicitar a reserva de uma sala. Sua solicitação será enviada para aprovação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BookingForm />
        </CardContent>
      </Card>
    </div>
  );
}
