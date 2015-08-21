#include <stdio.h>  
#include <stdlib.h>  

//定义链表结构
typedef struct node { 
    int data;
    struct node *next;
}Node;     

/*
创建链表 
根据用户输入 取决链表长度
 */
void creat(Node ** head, Node ** tail) { 
    int loop=1;
    int input_data = -1;
    Node * current;
    while(loop) {
        printf("请输入链表结点的数值，输入－1退出。\n");
        scanf("%d", &input_data);
        if(input_data != -1) {
            Node * new_node = malloc(sizeof(Node));
            new_node->data = input_data;
            new_node->next = NULL;
            if(*head == NULL) {
                *head = new_node;
                current = *head;
            }
            current->next = new_node;
            current = current -> next;
            *tail = current;
        }
        else
            loop =0;
    }
}

//输出结点
void output(Node * head, Node * tail) {

   Node *current = head;
   printf("链表首结点data: %d\n", head->data );
   printf("链表尾结点data: %d\n", tail->data );
   while(current!=NULL) {
        printf("%d\n", current->data);
        current = current->next;
   } 

}

//查找制定元素的顺序
void searchdata(Node *  head) { 
    Node * current = head;
    int target;
    int count =1;
    printf("请输入您想查找的data.\n");
    scanf("%d" , &target);
    while(current->next!=NULL) {
        if(current->data == target) {
            printf("您所寻找的结点在链表第%d位上。\n", count);
            break;
        }
        current= current->next;
        count++;
        if(current->next==NULL) {
            printf("链表中没有您所搜索的data。\n");
        }
    }
}


//元素之间插入值 
void insertdata(Node *  head) {
    Node * current = head;
    int target;
    int new_data;
    printf("请输入您想插入到哪个data之后。\n");
    scanf("%d" , &target);
    printf("请输入插入结点的数值。\n");
    scanf("%d" , &new_data);
    while(current->next!=NULL) {
        if(current->data==target) {
            Node * new_node = malloc(sizeof(Node));
            new_node->data = new_data;
            new_node->next = current->next;
            current->next = new_node; 
        }
        current= current->next;
        if(current->next==NULL) {
            printf("链表中没有您所搜索的data。\n");
        }
    }
}

int main () {
    Node *head=NULL;
    Node *tail=NULL;
    creat(&head,&tail);
    output(head, tail);
    searchdata(head);
    insertdata(head);
    output(head, tail);
}  