export const vehicles = ["Passeio", "Aplicativo (Uber/99)", "Táxi", "Autoescola", "Moto", "SUV / picape / utilitário", "Van", "Caminhão / cavalo mecânico / semirreboque", "Locadora"] as const;
export const situations = ["Sem proteção", "Já tenho e quero comparar", "Proteção vence em breve", "Veículo recém-adquirido"] as const;
export const timings = ["Imediatamente", "Em até 7 dias", "Em até 15 dias", "Em até 30 dias", "Ainda estou pesquisando"] as const;
export const decisions = ["Sim, eu decido", "Decido junto com outra pessoa", "Não, só estou pesquisando para outra pessoa"] as const;

export function qualifies(timing: string, decision: string) {
  return timings.slice(0, 3).includes(timing as typeof timings[number]) && decisions.slice(0, 2).includes(decision as typeof decisions[number]);
}
