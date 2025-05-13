import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import type { ShoppingListResponse } from '../../types';

interface ListCardProps {
    list: ShoppingListResponse;
}

export const ListCard = ({ list }: ListCardProps) => {
    return (
        <Card className="hover:bg-accent cursor-pointer transition-colors" onClick={() => window.location.href = `/lists/${list.id}`}>
            <CardHeader>
                <CardTitle>{list.title || 'Lista bez nazwy'}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {list.plannedShoppingDate && (
                        <p className="text-sm text-muted-foreground">
                            Planowane zakupy: {format(new Date(list.plannedShoppingDate), 'PPP', { locale: pl })}
                        </p>
                    )}
                    {list.storeName && (
                        <p className="text-sm text-muted-foreground">
                            Sklep: {list.storeName}
                        </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                        Liczba produktów: {list.productsCount}
                    </p>
                </div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
                <div className="flex justify-between w-full">
                    <span>Utworzono: {format(new Date(list.createdAt), 'Pp', { locale: pl })}</span>
                    <span className="capitalize">{list.source}</span>
                </div>
            </CardFooter>
        </Card>
    );
};