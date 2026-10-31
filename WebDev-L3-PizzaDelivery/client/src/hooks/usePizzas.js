import { useQuery } from "@tanstack/react-query";
import { getAllPizzas } from "../services/pizzaServices";
export const usePizzas = () => {
    return useQuery(
        {
            queryKey:['pizzas'],
            queryFn:getAllPizzas
        }
    )
}