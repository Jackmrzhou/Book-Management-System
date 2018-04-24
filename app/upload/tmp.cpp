#include <stdio.h>
#include <stdlib.h>
typedef struct{
    void (*f)();
}Demo;

void call_me_maybe(){
    printf("Queen forever!\n");
}

void call(){
    printf("Freddie Mercury!\n");
}

int main(){
    Demo *t1 = (Demo*)malloc(sizeof(Demo));
    free(t1);
    Demo *t2 = (Demo*)malloc(sizeof(Demo));
    t2->f = call_me_maybe;
    t1->f();
    t1->f = call;
    t2->f();
    return 0;
}