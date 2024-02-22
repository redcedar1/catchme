from asgiref.sync import async_to_sync, sync_to_async
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
import json


class DataConsumer(AsyncWebsocketConsumer):
    # user_ready 메시지를 처리하는 메서드
    async def user_ready(self, event):
        pass

    async def user_not_ready(self, event):
        pass
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'data_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')
        kid = text_data_json.get('kid')

        if message_type == 'ready' and kid is not None:
            try:
                is_updated = await self.update_user_ready(kid, True)
            except userInfo.DoesNotExist:
                print(f"No user with kid {kid} exists.")
                return

            if is_updated:
                await self.send(text_data=json.dumps({'message': 'api 리랜더링'}))

        elif message_type == 'not_ready' and kid is not None:
            try:
                is_updated = await self.update_user_ready(kid, False)
            except userInfo.DoesNotExist:
                print(f"No user with kid {kid} exists.")
                return

            if is_updated:
                await self.send(text_data=json.dumps({'message': 'api 리랜더링'}))

        elif message_type == 'selected_bubble':
            chat_message = text_data_json.get('chat')
            if chat_message is not None:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': chat_message,
                    }
                )

    async def send_chat_message(self, event):
        # 웹소켓으로 메시지를 보낼 때 실행되는 메서드
        message = event['message']
        await self.send(text_data=json.dumps({
            'message': message
        }))

    # 데이터베이스 업데이트 함수
    @sync_to_async
    def update_user_ready(self, kid, ready):
        from common.models import userInfo, menInfo, womenInfo
        user = userInfo.objects.get(kid=kid)
        is_updated = False
        if user.ismale:
            current_ready = menInfo.objects.filter(user=user).first().ready
            if current_ready != ready:
                menInfo.objects.filter(user=user).update(ready=ready)
                is_updated = True
        else:
            current_ready = womenInfo.objects.filter(user=user).first().ready
            if current_ready != ready:
                womenInfo.objects.filter(user=user).update(ready=ready)
                is_updated = True
        return is_updated