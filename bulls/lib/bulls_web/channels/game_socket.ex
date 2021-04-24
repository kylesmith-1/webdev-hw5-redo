defmodule BullsWeb.GameChannel do
  use BullsWeb, :channel

  alias Bulls.Game

  @impl true
  def join("game", payload, socket) do
    game = Game.newState()
    socket = assign(socket, :game, game)
    view = Game.view(game)
    {:ok, view, socket}
  end

  @impl true
  def handle_in("guess", %{"number" => n}, socket) do
    game_prev = socket.assigns[:game]
    game_cur = Game.makeGuess(game_prev, n)
    socket = assign(socket, :game, game_cur)
    view = Game.view(game_cur)
    {:reply, {:ok, view}, socket}
  end

  @impl true
  def handle_in("reset", _, socket) do
    game = Game.newState()
    socket = assign(socket, :game, game)
    view = Game.view(game)
    {:reply, {:ok, view}, socket}
  end

end