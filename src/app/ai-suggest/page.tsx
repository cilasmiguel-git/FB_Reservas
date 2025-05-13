import AiSuggestionForm from '@/components/ai-suggestion-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

export default function AiSuggestPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <Lightbulb className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Sugestão de Salas com IA</CardTitle>
          <CardDescription className="text-md max-w-xl mx-auto">
            Não sabe qual sala escolher? Descreva seu evento ou aula e nossa Inteligência Artificial
            irá sugerir as melhores opções com base no histórico de disponibilidade e características.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AiSuggestionForm />
        </CardContent>
      </Card>
    </div>
  );
}
